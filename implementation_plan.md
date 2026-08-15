# Implementation Plan — HAVEN Architecture Amendment: Isolated Dev Preview & Enhanced AI Parser

This plan refactors the application to decouple developer preview controls from the primary consumer product interface and significantly strengthens the AI Natural Language parser for informal Vietnamese phrasing.

## User Review Required

> [!IMPORTANT]
> **Key Architecture Changes**:
> 1. **Decoupled User UI**: Remove "Consumer Preview / Admin Preview" toggle buttons from production `Topbar.tsx` and `Sidebar.tsx`. The main HAVEN application renders a clean, consumer-facing rental discovery experience.
> 2. **Isolated Developer Preview (`src/devtools/preview/`)**:
>    - Create isolated module `src/devtools/preview/` containing `DevPreviewLauncher.tsx` and helper hooks.
>    - Supports opening User Preview and Admin Preview in separate tabs/windows via URL parameter (`?view=admin` vs default consumer mode) or a discrete dev floating widget.
>    - **Clean Removability**: Deleting `src/devtools/preview/` and removing 1 single entry hook leaves HAVEN 100% functional.
> 3. **Enhanced Informal Vietnamese AI Parser**:
>    - Normalize shorthand ("2pn", "18 củ", "20tr", "HN", "SG", "chill chill nhiều cây", "không ngập", "không tầng thấp").
>    - Categorize criteria into **Required**, **Preferred**, **Nice to Have**, and **Avoid**.
>    - Display structured interpretation summary with transparent follow-up tips.

---

## Proposed Changes

### 1. Developer Preview Isolation System

#### [NEW] [DevPreviewLauncher.tsx](file:///d:/AAA/src/devtools/preview/DevPreviewLauncher.tsx)
- Isolated floating developer widget (only visible when dev preview query parameter or local dev mode is active).
- Buttons: "Open User Preview (New Window)" and "Open Admin Preview (New Window)" launching `?view=user` and `?view=admin` respectively.

#### [MODIFY] [App.tsx](file:///d:/AAA/src/App.tsx)
- Revert hardcoded `currentMode` state parameter from core UI components.
- Check URL parameter `?view=admin` to determine whether to render the Admin Property Operations platform or the primary HAVEN Consumer Sanctuary experience.
- Include isolated DevPreviewLauncher conditionally.

#### [MODIFY] [Topbar.tsx](file:///d:/AAA/src/components/Topbar.tsx)
- Remove `currentMode` toggle pills and role switcher from Topbar.
- Keep Topbar clean and consumer-focused (Logo, Saved count, Search bar, AI Housing Advisor, Theme switcher).

#### [MODIFY] [Sidebar.tsx](file:///d:/AAA/src/components/Sidebar.tsx)
- Remove `currentMode` toggle from Sidebar. In HAVEN Consumer Mode, render consumer links (Home, Explore & Search, Saved & Compare, AI Housing Advisor). In Admin Mode, render property management links.

---

### 2. Enhanced Natural Language AI Parser (Vietnamese Shorthand & Classification)

#### [MODIFY] [aiAdvisorService.ts](file:///d:/AAA/src/services/aiAdvisorService.ts)
- Extend `parseNaturalLanguageQuery(queryText)` to parse:
  - **Shorthand VND**: "18 củ", "18tr", "18m", "18 triệu" -> 18,000,000 VND.
  - **Shorthand Bedrooms**: "2pn", "2 phong ngu", "2 phòng", "2br" -> 2 beds.
  - **Shorthand Cities & Districts**: "hn", "hà nội", "tây hồ", "thảo điền", "q1", "đà nẵng".
  - **Intent & Lifestyle Classification**:
    - **Required**: Car parking ("có chỗ ô tô", "cần ô tô").
    - **Preferred**: Floor height ("tầng cao", "không tầng thấp quá"), price budget ("tầm 18M").
    - **Avoid**: Flood risk ("đừng ngập", "không ngập"), noise ("yên tĩnh", "thích yên tĩnh").
- Return structured AI interpretation:
  - `required`: string[]
  - `preferred`: string[]
  - `avoid`: string[]
  - `formattedSummary`: formatted bullet list for UI display.

---

## Verification Plan

### Automated Build & Compilation Check
- Run `npm run build` (`tsc -b && vite build`) to ensure zero errors.

### Manual UX & Preview Verification
1. **Clean Consumer UI**: Open default `http://localhost:5173/` and verify Topbar/Sidebar contain NO developer role toggle pills.
2. **Isolated Preview Windows**: Click "Open Admin Preview" in dev widget to launch `?view=admin` in a new tab; verify both User & Admin tabs can run simultaneously.
3. **Informal Vietnamese AI Queries**:
   - Test query: *"tìm hộ tao căn 2pn ở HN tầm 18 củ có chỗ ô tô không ngập"*
   - Verify parser extracts: City: Hanoi, Bedrooms: 2+, Max Budget: 18M VND, Required: Car parking, Avoid: Flooding risk.
4. **Removability Check**: Verify `src/devtools/preview/` is fully isolated.
