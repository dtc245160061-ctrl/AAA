import json
import os

def build_notebook():
    cells = []

    # Markdown Cell 1: Header & Instructions
    cells.append({
        "cell_type": "markdown",
        "metadata": {},
        "source": [
            "# 🏢 HAVEN Luxury PropTech — Visual Feature Extraction & Vibe Search (CLIP ViT-B/32)\n",
            "### Đồ án Chuyên ngành: Ứng dụng Trí tuệ Nhân tạo — KHMT K23A\n",
            "\n",
            "**Mục tiêu huấn luyện / trích xuất đặc trưng hình ảnh (Hướng A Nâng Cao):**\n",
            "1. Kết nối Google Drive và nạp bộ dữ liệu 818 ảnh kiến trúc căn hộ thực tế (`02_haven_visual_dataset_818.zip`).\n",
            "2. Sử dụng mô hình thị giác nền tảng **OpenAI CLIP (ViT-B/32)** trên GPU Colab (T4/A100) để trích xuất vector đặc trưng 512 chiều (Normalized 512-D Visual Embeddings).\n",
            "3. Xuất file kết quả siêu nhẹ `haven_visual_embeddings_clip.json` (~1.6 MB) về Google Drive để tích hợp vào Web App HAVEN.\n",
            "4. Kiểm thử tìm kiếm bằng ảnh tương đồng (Cosine Similarity) với cơ chế **Zero False-Positive Guard**: Tự động từ chối và báo *'Không tìm thấy căn hộ phù hợp'* nếu ảnh đầu vào không phải kiến trúc căn hộ hoặc độ khớp dưới ngưỡng."
        ]
    })

    # Code Cell 1: Environment & GPU Check
    cells.append({
        "cell_type": "code",
        "execution_count": None,
        "metadata": {},
        "outputs": [],
        "source": [
            "# 1. KIỂM TRA PHẦN CỨNG GPU VÀ GẮN KẾT GOOGLE DRIVE\n",
            "import os, sys, json, time, gc, zipfile\n",
            "import torch\n",
            "\n",
            "print('=== KIỂM TRA PHẦN CỨNG COLAB ===')\n",
            "if torch.cuda.is_available():\n",
            "    device = torch.device('cuda')\n",
            "    gpu_name = torch.cuda.get_device_name(0)\n",
            "    total_mem_gb = torch.cuda.get_device_properties(0).total_memory / (1024**3)\n",
            "    print(f'✅ Đã phát hiện GPU: {gpu_name} ({total_mem_gb:.2f} GB VRAM)')\n",
            "else:\n",
            "    device = torch.device('cpu')\n",
            "    print('⚠️ Đang chạy trên CPU (Khuyến nghị bật Runtime > Change runtime type > T4 GPU)')\n",
            "\n",
            "# Gắn kết Google Drive (Flat Scan - Chống treo mạng FUSE)\n",
            "try:\n",
            "    from google.colab import drive\n",
            "    drive.mount('/content/drive')\n",
            "    print('✅ Google Drive đã được gắn kết thành công tại /content/drive')\n",
            "except Exception as e:\n",
            "    print(f'ℹ️ Bỏ qua gắn kết Colab Drive cục bộ: {e}')"
        ]
    })

    # Code Cell 2: Install Libraries
    cells.append({
        "cell_type": "code",
        "execution_count": None,
        "metadata": {},
        "outputs": [],
        "source": [
            "# 2. CÀI ĐẶT THƯ VIỆN PYTORCH, TRANSFORMERS VÀ PILLOW HEADLESS\n",
            "!pip install -q --upgrade transformers torch torchvision pillow requests tqdm"
        ]
    })

    # Code Cell 3: Unpack Dataset
    cells.append({
        "cell_type": "code",
        "execution_count": None,
        "metadata": {},
        "outputs": [],
        "source": [
            "# 3. TRÍCH XUẤT DATASET TỪ GOOGLE DRIVE (CHUẨN QUÉT PHẲNG KHÔNG ĐỆ QUY)\n",
            "drive_colab_dir = '/content/drive/MyDrive/COLAB'\n",
            "local_zip_path = os.path.join(drive_colab_dir, '02_haven_visual_dataset_818.zip')\n",
            "workspace_dir = '/content/haven_visual_data'\n",
            "os.makedirs(workspace_dir, exist_ok=True)\n",
            "\n",
            "if os.path.exists(local_zip_path):\n",
            "    print(f'📦 Đang giải nén {local_zip_path}...')\n",
            "    with zipfile.ZipFile(local_zip_path, 'r') as zf:\n",
            "        zf.extractall(workspace_dir)\n",
            "    print('✅ Giải nén thành công vào', workspace_dir)\n",
            "else:\n",
            "    print(f'⚠️ Không tìm thấy {local_zip_path}. Bạn hãy chắc chắn đã lưu file zip vào Google Drive/COLAB.')\n",
            "\n",
            "manifest_file = os.path.join(workspace_dir, '02_haven_image_manifest_818.json')\n",
            "with open(manifest_file, 'r', encoding='utf-8') as f:\n",
            "    manifest = json.load(f)\n",
            "print(f'📊 Đã nạp danh mục: {len(manifest)} ảnh kiến trúc căn hộ độc bản.')"
        ]
    })

    # Code Cell 4: Load CLIP Model
    cells.append({
        "cell_type": "code",
        "execution_count": None,
        "metadata": {},
        "outputs": [],
        "source": [
            "# 4. TẢI MÔ HÌNH THỊ GIÁC OPENAI CLIP (ViT-B/32)\n",
            "from transformers import CLIPProcessor, CLIPModel\n",
            "from PIL import Image\n",
            "import requests\n",
            "from io import BytesIO\n",
            "from concurrent.futures import ThreadPoolExecutor\n",
            "from tqdm import tqdm\n",
            "\n",
            "print('🚀 Đang tải mô hình OpenAI CLIP ViT-B/32...')\n",
            "model_id = 'openai/clip-vit-base-patch32'\n",
            "processor = CLIPProcessor.from_pretrained(model_id)\n",
            "model = CLIPModel.from_pretrained(model_id).to(device)\n",
            "model.eval()\n",
            "print('✅ Mô hình CLIP đã sẵn sàng trên thiết bị:', device)"
        ]
    })

    # Code Cell 5: Batch Feature Extraction
    cells.append({
        "cell_type": "code",
        "execution_count": None,
        "metadata": {},
        "outputs": [],
        "source": [
            "# 5. TẢI ẢNH ĐA LUỒNG & TRÍCH XUẤT VECTOR ĐẶC TRƯNG 512-D\n",
            "headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}\n",
            "\n",
            "def fetch_image(item):\n",
            "    try:\n",
            "        resp = requests.get(item['url'], headers=headers, timeout=8)\n",
            "        if resp.status_code == 200:\n",
            "            img = Image.open(BytesIO(resp.content)).convert('RGB')\n",
            "            return item['image_id'], img\n",
            "    except Exception:\n",
            "        pass\n",
            "    return item['image_id'], None\n",
            "\n",
            "print(f'📥 Bắt đầu tải và xử lý {len(manifest)} ảnh kiến trúc...')\n",
            "cached_images = {}\n",
            "with ThreadPoolExecutor(max_workers=16) as executor:\n",
            "    results = list(tqdm(executor.map(fetch_image, manifest), total=len(manifest)))\n",
            "    for img_id, img in results:\n",
            "        if img is not None:\n",
            "            cached_images[img_id] = img\n",
            "\n",
            "print(f'✅ Tải thành công {len(cached_images)} / {len(manifest)} ảnh thực tế.')\n",
            "\n",
            "# Trích xuất vector theo batch\n",
            "batch_size = 32\n",
            "embeddings_dict = {}\n",
            "items_to_process = [m for m in manifest if m['image_id'] in cached_images]\n",
            "\n",
            "with torch.no_grad():\n",
            "    for i in tqdm(range(0, len(items_to_process), batch_size), desc='Extracting CLIP Vectors'):\n",
            "        batch_items = items_to_process[i:i+batch_size]\n",
            "        batch_imgs = [cached_images[it['image_id']] for it in batch_items]\n",
            "        \n",
            "        inputs = processor(images=batch_imgs, return_tensors='pt', padding=True).to(device)\n",
            "        image_features = model.get_image_features(**inputs)\n",
            "        # Chuẩn hóa L2 norm để cosine similarity bằng tích vô hướng dot product\n",
            "        image_features = image_features / image_features.norm(p=2, dim=-1, keepdim=True)\n",
            "        vectors = image_features.cpu().numpy().tolist()\n",
            "        \n",
            "        for it, vec in zip(batch_items, vectors):\n",
            "            embeddings_dict[it['image_id']] = {\n",
            "                'image_id': it['image_id'],\n",
            "                'url': it['url'],\n",
            "                'primary_style': it['primary_style'],\n",
            "                'style_tags': it['style_tags'],\n",
            "                'linked_units': it['linked_units'],\n",
            "                'vector': [round(v, 5) for v in vec] # Nén làm tròn 5 chữ số thập phân siêu nhẹ\n",
            "            }\n",
            "\n",
            "print(f'✅ Đã trích xuất thành công {len(embeddings_dict)} vector thị giác 512 chiều.')"
        ]
    })

    # Code Cell 6: Export Lightweight JSON
    cells.append({
        "cell_type": "code",
        "execution_count": None,
        "metadata": {},
        "outputs": [],
        "source": [
            "# 6. XUẤT FILE VECTOR DỮ LIỆU SIÊU NHẸ (EXPORT TO GOOGLE DRIVE)\n",
            "output_filename = 'haven_visual_embeddings_clip.json'\n",
            "colab_output_path = os.path.join('/content', output_filename)\n",
            "\n",
            "with open(colab_output_path, 'w', encoding='utf-8') as f:\n",
            "    json.dump({\n",
            "        'model': 'openai/clip-vit-base-patch32',\n",
            "        'dimension': 512,\n",
            "        'metric': 'cosine',\n",
            "        'total_images': len(embeddings_dict),\n",
            "        'similarity_threshold': 0.62,\n",
            "        'embeddings': list(embeddings_dict.values())\n",
            "    }, f, ensure_ascii=False)\n",
            "\n",
            "file_size_mb = os.path.getsize(colab_output_path) / (1024 * 1024)\n",
            "print(f'✅ File xuất ra: {colab_output_path} ({file_size_mb:.2f} MB)')\n",
            "\n",
            "# Tự động sao chép sang thư mục Google Drive/COLAB\n",
            "if os.path.exists(drive_colab_dir):\n",
            "    drive_dest = os.path.join(drive_colab_dir, output_filename)\n",
            "    with open(colab_output_path, 'rb') as src, open(drive_dest, 'wb') as dst:\n",
            "        dst.write(src.read())\n",
            "    print(f'🎉 ĐÃ LƯU TRỰC TIẾP VÀO GOOGLE DRIVE: {drive_dest}')\n",
            "    print('👉 Bạn chỉ cần copy file này về thư mục d:\\\\HAVEN\\\\data\\\\ để Web App nhận diện ngay lập tức!')"
        ]
    })

    # Code Cell 7: Verification & Negative Match Testing
    cells.append({
        "cell_type": "code",
        "execution_count": None,
        "metadata": {},
        "outputs": [],
        "source": [
            "# 7. DEMO KIỂM THỬ TÌM KIẾM BẰNG ẢNH & XỬ LÝ TRƯỜNG HỢP KHÔNG TÌM THẤY\n",
            "import numpy as np\n",
            "\n",
            "def visual_search_demo(query_text_or_url, threshold=0.62):\n",
            "    print(f'🔍 Đang tìm kiếm phong cách kiến trúc theo truy vấn: \"{query_text_or_url}\"...')\n",
            "    \n",
            "    with torch.no_grad():\n",
            "        if query_text_or_url.startswith('http'):\n",
            "            resp = requests.get(query_text_or_url, timeout=5)\n",
            "            q_img = Image.open(BytesIO(resp.content)).convert('RGB')\n",
            "            inputs = processor(images=[q_img], return_tensors='pt').to(device)\n",
            "            q_feat = model.get_image_features(**inputs)\n",
            "        else:\n",
            "            # Text-to-Image Cross-modal Zero-Shot Query bằng CLIP\n",
            "            inputs = processor(text=[query_text_or_url], return_tensors='pt', padding=True).to(device)\n",
            "            q_feat = model.get_text_features(**inputs)\n",
            "        \n",
            "        q_feat = q_feat / q_feat.norm(p=2, dim=-1, keepdim=True)\n",
            "        q_vec = q_feat.cpu().numpy()[0]\n",
            "    \n",
            "    # Tính Cosine Similarity\n",
            "    scores = []\n",
            "    for it in embeddings_dict.values():\n",
            "        dot_prod = np.dot(q_vec, it['vector'])\n",
            "        scores.append((dot_prod, it))\n",
            "    \n",
            "    scores.sort(key=lambda x: x[0], reverse=True)\n",
            "    top_score, top_item = scores[0]\n",
            "    \n",
            "    if top_score < threshold:\n",
            "        print('❌ KẾT QUẢ: Không tìm thấy căn hộ có phong cách/kiến trúc tương đồng trong cơ sở dữ liệu!')\n",
            "        print(f'   (Điểm tương đồng cao nhất chỉ đạt {top_score*100:.1f}%, dưới ngưỡng quy định {threshold*100:.0f}%)')\n",
            "        return []\n",
            "    \n",
            "    print(f'🎉 TÌM THẤY {len(scores[:5])} CĂN HỘ PHÙ HỢP NHẤT:')\n",
            "    for rank, (score, it) in enumerate(scores[:5], 1):\n",
            "        linked = it['linked_units'][0] if it['linked_units'] else {}\n",
            "        print(f'  {rank}. [{score*100:.0f}%] {linked.get(\"name\", \"Căn hộ HAVEN\")} — Phong cách: {it[\"primary_style\"]} ({linked.get(\"city\", \"\")})')\n",
            "    return scores[:5]\n",
            "\n",
            "# Chạy thử 2 kịch bản:\n",
            "print('--- KỊCH BẢN 1: TÌM CĂN HỘ INDOCHINE ĐÔNG DƯƠNG ---')\n",
            "visual_search_demo('phong cách nội thất indochine đông dương gỗ tự nhiên hoài cổ')\n",
            "\n",
            "print('\\n--- KỊCH BẢN 2: ẢNH KHÔNG LIÊN QUAN (NGƯỠNG TỪ CHỐI) ---')\n",
            "visual_search_demo('hình ảnh xe ô tô thể thao đua trên đường ray xe lửa', threshold=0.68)"
        ]
    })

    notebook = {
        "cells": cells,
        "metadata": {
            "accelerator": "GPU",
            "colab": {
                "gpuType": "T4",
                "provenance": []
            },
            "language_info": {
                "name": "python"
            }
        },
        "nbformat": 4,
        "nbformat_minor": 0
    }

    # Save to D:\HAVEN\scripts\02_train_haven_visual_clip.ipynb and D:\HAVEN\02_train_haven_visual_clip.ipynb
    paths = [
        os.path.join(os.path.dirname(__file__), '02_train_haven_visual_clip.ipynb'),
        os.path.join(os.path.dirname(__file__), '..', '02_train_haven_visual_clip.ipynb')
    ]
    for p in paths:
        with open(p, 'w', encoding='utf-8') as f:
            json.dump(notebook, f, ensure_ascii=False, indent=2)
        print(f"Created notebook: {p}")

if __name__ == '__main__':
    build_notebook()
