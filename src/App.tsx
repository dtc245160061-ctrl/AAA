import { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';
import { Sidebar } from './components/Sidebar';
import { MobileNav } from './components/layout/MobileNav';
import { Topbar } from './components/Topbar';
import { UserHomeView } from './components/UserHomeView';
import { UserSearchView } from './components/UserSearchView';
import { UserUnitDetailView } from './components/UserUnitDetailView';
import { UserCompareView } from './components/UserCompareView';
import { ConfidenceMapView } from './components/ConfidenceMapView';
import { MoveInChecklistView } from './components/MoveInChecklistView';
import { UserAiAdvisorDrawer } from './components/UserAiAdvisorDrawer';
import { NeighborhoodGuideView } from './components/NeighborhoodGuideView';
import { DocumentVaultView } from './components/DocumentVaultView';
import { MarketplaceHealthView } from './components/MarketplaceHealthView';
import { CommuteSimulatorModal } from './components/CommuteSimulatorModal';
import { DepositEscrowModal } from './components/DepositEscrowModal';
import { VirtualTourModal } from './components/VirtualTourModal';
import { LandlordProfileModal } from './components/LandlordProfileModal';
import { SmartListingCreatorModal } from './components/SmartListingCreatorModal';
import { DashboardView } from './components/DashboardView';
import { UnitsView } from './components/UnitsView';
import { LeadsView } from './components/LeadsView';
import { ContractsView } from './components/ContractsView';
import { PaymentsView } from './components/PaymentsView';
import { AdminInboxView } from './components/AdminInboxView';
import { SubscriptionsView } from './components/SubscriptionsView';
import { ServicesMarketplaceView } from './components/ServicesMarketplaceView';
import { ChatModal } from './components/ChatModal';
import { AiCopilotDrawer } from './components/AiCopilotDrawer';
import { QuickActionModal } from './components/QuickActionModal';
import { DevPreviewLauncher } from './devtools/preview/DevPreviewLauncher';
import { ToastContainer, type ToastMessage } from './components/Toast';
import { ApartmentStore } from './data/apartmentStore';
import type { 
  ApartmentUnit, 
  RentalLead, 
  LeaseContract, 
  RentalInvoice, 
  LeadStatus, 
  UnitStatus,
  ChatConversation,
  LandlordProfile
} from './types/apartment';

export type ThemeMode = 'dark' | 'light' | 'system';

export function App() {
  // Read initial view from URL query parameter e.g. ?view=admin
  const [isAdminView, setIsAdminView] = useState<boolean>(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('view') === 'admin';
  });

  const [activeModule, setActiveModule] = useState<string>(() => isAdminView ? 'dashboard' : 'user_home');
  const [selectedUnitId, setSelectedUnitId] = useState<string>('HN-TH-2401');
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(() => {
    return localStorage.getItem('haven_sidebar_collapsed') === 'true';
  });
  const [initialAiQuery, setInitialAiQuery] = useState<string>('');
  
  // Reactive Central State from ApartmentStore
  const [units, setUnits] = useState<ApartmentUnit[]>(() => ApartmentStore.getUnits());
  const [leads, setLeads] = useState<RentalLead[]>(() => ApartmentStore.getLeads());
  const [contracts, setContracts] = useState<LeaseContract[]>(() => ApartmentStore.getContracts());
  const [invoices, setInvoices] = useState<RentalInvoice[]>(() => ApartmentStore.getInvoices());
  const [savedUnitIds, setSavedUnitIds] = useState<string[]>(() => ApartmentStore.getSavedUnitIds());
  const [conversations, setConversations] = useState<ChatConversation[]>(() => ApartmentStore.getConversations());

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = (type: 'success' | 'error' | 'info', title: string, description?: string) => {
    setToasts(prev => {
      // Prevent duplicate identical toasts in rapid succession
      if (prev.some(t => t.title === title && t.description === description)) {
        return prev;
      }
      const newToast: ToastMessage = {
        id: `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        type,
        title,
        description
      };
      return [...prev, newToast];
    });
  };

  const dismissToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Modals & Drawers
  const [isAiCopilotOpen, setIsAiCopilotOpen] = useState<boolean>(false);
  const [isUserAiAdvisorOpen, setIsUserAiAdvisorOpen] = useState<boolean>(false);
  const [isQuickActionOpen, setIsQuickActionOpen] = useState<boolean>(false);
  const [bookingUnit, setBookingUnit] = useState<ApartmentUnit | null>(null);
  const [activeChatUnit, setActiveChatUnit] = useState<ApartmentUnit | null>(null);
  const [activeCommuteUnit, setActiveCommuteUnit] = useState<ApartmentUnit | null>(null);
  const [activeEscrowUnit, setActiveEscrowUnit] = useState<ApartmentUnit | null>(null);
  const [activeVirtualTourUnit, setActiveVirtualTourUnit] = useState<ApartmentUnit | null>(null);
  const [activeLandlordProfile, setActiveLandlordProfile] = useState<LandlordProfile | null>(null);
  const [isSmartListingOpen, setIsSmartListingOpen] = useState<boolean>(false);

  // Form fields for Booking Modal
  const [bookingName, setBookingName] = useState('');
  const [bookingPhone, setBookingPhone] = useState('');
  const [bookingMoveInDate, setBookingMoveInDate] = useState('2026-09-01');
  const [bookingViewingDate, setBookingViewingDate] = useState('2026-08-18 14:00');
  const [bookingNotes, setBookingNotes] = useState('');

  // Lead Conversion State
  const [leadContractData, setLeadContractData] = useState<Partial<LeaseContract> | null>(null);

  const [themeMode, setThemeMode] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('property_ops_theme');
    if (saved === 'light' || saved === 'dark' || saved === 'system') {
      return saved;
    }
    return 'dark';
  });

  useEffect(() => {
    localStorage.setItem('property_ops_theme', themeMode);

    const applyTheme = () => {
      let resolved: 'dark' | 'light' = 'dark';
      if (themeMode === 'system') {
        resolved = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      } else {
        resolved = themeMode;
      }
      document.documentElement.setAttribute('data-theme', resolved);
      if (resolved === 'light') {
        document.documentElement.classList.add('light');
        document.documentElement.classList.remove('dark');
      } else {
        document.documentElement.classList.add('dark');
        document.documentElement.classList.remove('light');
      }
    };

    applyTheme();

    if (themeMode === 'system') {
      const media = window.matchMedia('(prefers-color-scheme: dark)');
      const listener = () => applyTheme();
      media.addEventListener('change', listener);
      return () => media.removeEventListener('change', listener);
    }
  }, [themeMode]);

  // Scroll to top on route / module change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [activeModule]);

  const handleToggleSaveUnit = (unitId: string) => {
    const updated = savedUnitIds.includes(unitId)
      ? savedUnitIds.filter(id => id !== unitId)
      : [...savedUnitIds, unitId];
    setSavedUnitIds(updated);
    ApartmentStore.saveSavedUnitIds(updated);
    
    if (updated.includes(unitId)) {
      showToast('info', 'Đã lưu căn hộ', `Căn ${unitId} đã được thêm vào danh sách so sánh.`);
    }
  };

  const handleInspectUnit = (unitId: string) => {
    setSelectedUnitId(unitId);
    if (!isAdminView) {
      setActiveModule('user_detail');
    } else {
      setActiveModule('units');
    }
  };

  const handleNavigateSearch = (aiQuery?: string) => {
    if (aiQuery) {
      setInitialAiQuery(aiQuery);
    }
    setActiveModule('user_search');
  };

  // Booking Inquiry Submission (Consumer -> Admin)
  const handleSubmitBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingUnit) return;

    ApartmentStore.addLead({
      customerName: bookingName,
      phone: bookingPhone,
      unitId: bookingUnit.id,
      unitName: bookingUnit.name || bookingUnit.id,
      unitPriceVND: bookingUnit.monthlyRentVND,
      desiredMoveInDate: bookingMoveInDate,
      viewingDate: bookingViewingDate,
      notes: bookingNotes
    });

    setLeads(ApartmentStore.getLeads());
    setBookingUnit(null);
    setBookingName('');
    setBookingPhone('');
    setBookingNotes('');

    showToast(
      'success',
      'Đặt lịch xem căn hộ thành công!',
      `Yêu cầu của bạn cho căn ${bookingUnit.name || bookingUnit.id} đã được gửi tới Ban Quản Trị.`
    );
  };

  // Update Lead Status
  const handleUpdateLeadStatus = (id: string, status: LeadStatus) => {
    ApartmentStore.updateLeadStatus(id, status);
    setLeads(ApartmentStore.getLeads());
    showToast('info', 'Đã cập nhật trạng thái yêu cầu', `Mã yêu cầu ${id} chuyển sang: ${status}`);
  };

  // Convert Lead to Contract
  const handleCreateContractFromLead = (lead: RentalLead) => {
    setLeadContractData({
      unitId: lead.unitId,
      unitName: lead.unitName,
      tenantName: lead.customerName,
      tenantPhone: lead.phone,
      monthlyRentVND: lead.unitPriceVND,
      depositVND: lead.unitPriceVND * 2,
    });
    ApartmentStore.updateLeadStatus(lead.id, 'converted');
    setLeads(ApartmentStore.getLeads());
    setActiveModule('contracts');
    showToast('success', 'Chuyển đổi thành công', `Đang tạo hợp đồng cho khách ${lead.customerName}`);
  };

  // Convert Chat Conversation to Contract
  const handleCreateContractFromChat = (conv: ChatConversation) => {
    const targetUnit = units.find(u => u.id === conv.unitId);
    const rentPrice = targetUnit ? targetUnit.monthlyRentVND : 350000000;
    setLeadContractData({
      unitId: conv.unitId,
      unitName: conv.unitName,
      tenantName: conv.customerName,
      tenantPhone: conv.customerPhone,
      monthlyRentVND: rentPrice,
      depositVND: rentPrice * 2,
    });
    setActiveModule('contracts');
    showToast('success', 'Chuyển đổi từ Chat sang Hợp Đồng', `Đang tạo bản thảo hợp đồng cho khách ${conv.customerName}`);
  };

  // Add New Contract
  const handleAddContract = (contractData: Omit<LeaseContract, 'id' | 'createdAt'>) => {
    ApartmentStore.addContract(contractData);
    setContracts(ApartmentStore.getContracts());
    setUnits(ApartmentStore.getUnits());
    showToast('success', 'Ký hợp đồng thành công!', `Hợp đồng ${contractData.contractNumber} đã được kích hoạt.`);
  };

  // Mark Invoice Paid
  const handleMarkInvoicePaid = (id: string) => {
    ApartmentStore.markInvoicePaid(id);
    setInvoices(ApartmentStore.getInvoices());
    showToast('success', 'Xác nhận thu tiền thành công', `Hóa đơn ${id} đã được đánh dấu Đã Thanh Toán.`);
  };

  // Update Unit Status
  const handleUpdateUnitStatus = (unitId: string, status: UnitStatus) => {
    ApartmentStore.updateUnitStatus(unitId, status);
    setUnits(ApartmentStore.getUnits());
    showToast('info', 'Đã cập nhật tình trạng căn hộ', `Căn ${unitId} hiện là: ${status}`);
  };

  const handleResetDemoData = () => {
    ApartmentStore.resetAll();
    setUnits(ApartmentStore.getUnits());
    setLeads(ApartmentStore.getLeads());
    setContracts(ApartmentStore.getContracts());
    setInvoices(ApartmentStore.getInvoices());
    setSavedUnitIds(ApartmentStore.getSavedUnitIds());
    setConversations(ApartmentStore.getConversations());
    setThemeMode('dark');
    setActiveModule(isAdminView ? 'dashboard' : 'user_home');
    showToast('info', 'Đã đặt lại dữ liệu mẫu', 'Toàn bộ kho dữ liệu đã được làm mới.');
  };

  const currentUnit = units.find(u => u.id === selectedUnitId) || units[0];
  const pendingLeadsCount = leads.filter(l => l.status === 'new' || l.status === 'viewing_scheduled').length;
  const unreadMessagesCount = conversations.reduce((sum, c) => sum + c.unreadCount, 0);

  return (
    <div className="min-h-screen canvas-surface text-slate-200 flex relative selection:bg-emerald-500/20 selection:text-emerald-200 overflow-x-hidden transition-colors duration-300">
      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      {/* Sidebar Navigation */}
      <Sidebar
        isAdminView={isAdminView}
        activeModule={activeModule}
        setActiveModule={setActiveModule}
        onOpenAiCopilot={() => {
          if (!isAdminView) {
            setIsUserAiAdvisorOpen(true);
          } else {
            setIsAiCopilotOpen(true);
          }
        }}
        savedCount={savedUnitIds.length}
        pendingLeadsCount={pendingLeadsCount}
        unreadMessagesCount={unreadMessagesCount}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => {
          const next = !sidebarCollapsed;
          setSidebarCollapsed(next);
          localStorage.setItem('haven_sidebar_collapsed', String(next));
        }}
      />

      {/* Main Content Layout Shell */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen relative z-10">
        {/* Topbar Header */}
        <Topbar
          isAdminView={isAdminView}
          savedCount={savedUnitIds.length}
          onOpenSaved={() => {
            setIsAdminView(false);
            setActiveModule('user_compare');
          }}
          onOpenAiCopilot={() => {
            if (!isAdminView) {
              setIsUserAiAdvisorOpen(true);
            } else {
              setIsAiCopilotOpen(true);
            }
          }}
          onOpenQuickAction={() => setIsQuickActionOpen(true)}
          themeMode={themeMode}
          onThemeChange={setThemeMode}
          onResetDemoData={handleResetDemoData}
          onToggleAdminView={() => {
            const nextAdmin = !isAdminView;
            setIsAdminView(nextAdmin);
            setActiveModule(nextAdmin ? 'dashboard' : 'user_home');
          }}
          onNavigate={(mod) => {
            setActiveModule(mod);
          }}
        />

        {/* Dynamic View Body Container */}
        <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto space-y-8 pb-20 md:pb-8">
          {/* USER MODE CONSUMER VIEWS */}
          {!isAdminView && activeModule === 'user_home' && (
            <UserHomeView
              units={units}
              savedUnitIds={savedUnitIds}
              onToggleSaveUnit={handleToggleSaveUnit}
              onSelectUnit={handleInspectUnit}
              onNavigateSearch={handleNavigateSearch}
            />
          )}

          {!isAdminView && activeModule === 'user_search' && (
            <UserSearchView
              units={units}
              savedUnitIds={savedUnitIds}
              onToggleSaveUnit={handleToggleSaveUnit}
              onSelectUnit={handleInspectUnit}
              initialAiQuery={initialAiQuery}
            />
          )}

          {!isAdminView && activeModule === 'user_detail' && (
            <UserUnitDetailView
              unit={currentUnit}
              isSaved={savedUnitIds.includes(currentUnit.id)}
              onToggleSaveUnit={handleToggleSaveUnit}
              onBackToDirectory={() => setActiveModule('user_search')}
              onOpenBookingModal={(u) => {
                setBookingUnit(u);
                setBookingName('');
                setBookingPhone('');
                setBookingNotes('');
              }}
              onOpenChat={(u) => setActiveChatUnit(u)}
              onOpenCommuteSimulator={(u) => setActiveCommuteUnit(u)}
              onOpenDepositEscrow={(u) => setActiveEscrowUnit(u)}
              onOpenVirtualTour={(u) => setActiveVirtualTourUnit(u)}
              onOpenLandlordProfile={(l) => setActiveLandlordProfile(l)}
            />
          )}

          {!isAdminView && activeModule === 'user_neighborhoods' && (
            <NeighborhoodGuideView
              units={units}
              onSelectUnit={handleInspectUnit}
              onNavigateSearchDistrict={(district) => {
                setInitialAiQuery(district);
                setActiveModule('user_search');
              }}
            />
          )}

          {!isAdminView && activeModule === 'user_map' && (
            <ConfidenceMapView
              units={units}
              onSelectUnit={(id) => {
                setSelectedUnitId(id);
                setActiveModule('user_detail');
              }}
              onBackToDirectory={() => setActiveModule('user_search')}
            />
          )}

          {!isAdminView && activeModule === 'user_compare' && (
            <UserCompareView
              units={units}
              savedUnitIds={savedUnitIds}
              onRemoveFromSaved={handleToggleSaveUnit}
              onSelectUnit={handleInspectUnit}
              onBackToDirectory={() => setActiveModule('user_search')}
              onAddSampleUnitsToCompare={(sampleIds) => {
                setSavedUnitIds(sampleIds);
                ApartmentStore.saveSavedUnitIds(sampleIds);
                showToast('info', 'Đã nạp 3 căn mẫu', 'Bảng so sánh và biểu đồ Radar đã sẵn sàng.');
              }}
            />
          )}

          {!isAdminView && activeModule === 'user_checklist' && (
            <MoveInChecklistView
              unit={currentUnit}
              units={units}
              onBackToDirectory={() => setActiveModule('user_search')}
            />
          )}

          {!isAdminView && activeModule === 'user_documents' && (
            <DocumentVaultView
              units={units}
              isAdminView={false}
            />
          )}

          {!isAdminView && activeModule === 'user_services' && (
            <ServicesMarketplaceView
              onShowToast={showToast}
              isConsumerView={true}
            />
          )}

          {!isAdminView && activeModule === 'user_subscriptions' && (
            <SubscriptionsView
              onShowToast={showToast}
              isConsumerView={true}
            />
          )}

          {/* ADMIN MODE OPERATIONAL VIEWS - 5 CORE PILLARS + CHAT, SAAS & GOVERNANCE */}
          {isAdminView && activeModule === 'dashboard' && (
            <DashboardView
              units={units}
              leads={leads}
              contracts={contracts}
              invoices={invoices}
              onSelectUnit={handleInspectUnit}
              onNavigateTab={setActiveModule}
              onOpenAiCopilot={() => setIsAiCopilotOpen(true)}
            />
          )}

          {isAdminView && activeModule === 'units' && (
            <UnitsView
              units={units}
              onSelectUnit={handleInspectUnit}
              onUpdateUnitStatus={handleUpdateUnitStatus}
              onOpenQuickAction={() => setIsSmartListingOpen(true)}
            />
          )}

          {isAdminView && activeModule === 'leads' && (
            <LeadsView
              leads={leads}
              onUpdateLeadStatus={handleUpdateLeadStatus}
              onCreateContractFromLead={handleCreateContractFromLead}
              onSelectUnit={handleInspectUnit}
            />
          )}

          {isAdminView && activeModule === 'inbox' && (
            <AdminInboxView
              conversations={conversations}
              onRefreshConversations={() => setConversations(ApartmentStore.getConversations())}
              onCreateContractFromChat={handleCreateContractFromChat}
              onSelectUnit={handleInspectUnit}
            />
          )}

          {isAdminView && activeModule === 'contracts' && (
            <ContractsView
              contracts={contracts}
              units={units}
              onAddContract={handleAddContract}
              onSelectUnit={handleInspectUnit}
              onOpenAiCopilot={() => setIsAiCopilotOpen(true)}
              initialLeadContractData={leadContractData}
              onClearLeadContractData={() => setLeadContractData(null)}
            />
          )}

          {isAdminView && activeModule === 'billing' && (
            <PaymentsView
              invoices={invoices}
              onMarkInvoicePaid={handleMarkInvoicePaid}
              onSelectUnit={handleInspectUnit}
              onOpenQuickAction={() => setIsQuickActionOpen(true)}
            />
          )}

          {isAdminView && activeModule === 'admin_health' && (
            <MarketplaceHealthView />
          )}

          {isAdminView && activeModule === 'admin_documents' && (
            <DocumentVaultView
              units={units}
              isAdminView={true}
            />
          )}

          {isAdminView && activeModule === 'subscriptions' && (
            <SubscriptionsView
              onShowToast={showToast}
              isConsumerView={false}
            />
          )}

          {isAdminView && activeModule === 'services' && (
            <ServicesMarketplaceView
              onShowToast={showToast}
              isConsumerView={false}
            />
          )}
        </main>
      </div>

      {/* PERSISTENT FLOATING AI HOUSING ADVISOR ACTION BUTTON (FAB) */}
      {!isAdminView && (
        <button
          onClick={() => setIsUserAiAdvisorOpen(true)}
          className="fixed bottom-20 md:bottom-6 right-4 md:right-6 z-40 group flex items-center gap-2.5 px-3.5 py-2 rounded-full bg-[var(--haven-surface-elevated)] hover:bg-[var(--haven-surface-raised)] border border-[var(--haven-border-accent)] hover:border-[var(--haven-border-focus)] shadow-[var(--shadow-elevated)] backdrop-blur-xl transition-all duration-200 active:scale-[0.98] text-left"
          title="Mở Trợ lý AI HAVEN"
        >
          <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 shadow-sm shrink-0">
            <Sparkles className="w-3.5 h-3.5 fill-slate-950" />
          </div>
          <div className="hidden sm:block pr-1">
            <div className="text-xs font-display font-semibold text-[var(--haven-text-primary)] group-hover:text-[var(--haven-emerald-400)] transition-colors flex items-center gap-1.5">
              <span>Trợ lý AI</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            </div>
            <div className="text-[10px] font-mono text-[var(--haven-text-tertiary)]">
              Tư vấn căn hộ
            </div>
          </div>
        </button>
      )}

      {/* Consumer AI Housing Advisor Drawer */}
      <UserAiAdvisorDrawer
        isOpen={isUserAiAdvisorOpen}
        onClose={() => setIsUserAiAdvisorOpen(false)}
        units={units}
        onApplyAiSearch={(queryText) => {
          setInitialAiQuery(queryText);
          setIsAdminView(false);
          setActiveModule('user_search');
        }}
      />

      {/* Admin AI Copilot Slide-Over Drawer */}
      <AiCopilotDrawer
        isOpen={isAiCopilotOpen}
        onClose={() => setIsAiCopilotOpen(false)}
      />

      {/* Admin Quick Action Modal */}
      <QuickActionModal
        isOpen={isQuickActionOpen}
        onClose={() => setIsQuickActionOpen(false)}
      />

      {/* Shopee-Style In-App Chat Modal */}
      {activeChatUnit && (
        <ChatModal
          isOpen={!!activeChatUnit}
          onClose={() => {
            setActiveChatUnit(null);
            setConversations(ApartmentStore.getConversations());
          }}
          unit={activeChatUnit}
          customerName="Trần Hải Đăng"
          customerPhone="0988 776 655"
          onOpenBookingModal={(u) => {
            setBookingUnit(u);
            setBookingName('Trần Hải Đăng');
            setBookingPhone('0988 776 655');
          }}
          onShowToast={showToast}
        />
      )}

      {/* Consumer Booking / Rental Inquiry Modal */}
      {bookingUnit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
          <div className="max-w-md w-full rounded-3xl atmospheric-panel border border-emerald-500/30 p-6 md:p-8 space-y-5 shadow-2xl backdrop-blur-2xl">
            <h3 className="font-serif text-2xl text-slate-100 font-bold">Đặt Lịch Xem & Đăng Ký Thuê Căn Hộ</h3>
            <p className="text-xs font-mono text-emerald-400">
              {bookingUnit.name || bookingUnit.id} • {(bookingUnit.monthlyRentVND / 1000000).toFixed(0)} Triệu/tháng
            </p>
            <form onSubmit={handleSubmitBooking} className="space-y-3.5 text-xs font-mono">
              <div>
                <label className="text-slate-400 block mb-1">Họ Và Tên Của Bạn *</label>
                <input 
                  type="text" 
                  required
                  value={bookingName}
                  onChange={(e) => setBookingName(e.target.value)}
                  placeholder="Ví dụ: Nguyễn Văn An" 
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 font-sans" 
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Số Điện Thoại / Zalo Liên Hệ *</label>
                <input 
                  type="text" 
                  required
                  value={bookingPhone}
                  onChange={(e) => setBookingPhone(e.target.value)}
                  placeholder="Ví dụ: 0987 654 321" 
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 font-sans" 
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Ngày Dự Kiến Vào Ở</label>
                  <input 
                    type="date" 
                    value={bookingMoveInDate}
                    onChange={(e) => setBookingMoveInDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 focus:outline-none focus:border-emerald-500 font-sans" 
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Lịch Hẹn Xem Nhà</label>
                  <input 
                    type="text" 
                    value={bookingViewingDate}
                    onChange={(e) => setBookingViewingDate(e.target.value)}
                    placeholder="18/08 14:00"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 focus:outline-none focus:border-emerald-500 font-sans" 
                  />
                </div>
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Ghi Chú Nhu Cầu</label>
                <textarea 
                  rows={2}
                  value={bookingNotes}
                  onChange={(e) => setBookingNotes(e.target.value)}
                  placeholder="Ví dụ: Cần chỗ đỗ xe ô tô 7 chỗ, nuôi 1 bé mèo..." 
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 font-sans" 
                />
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setBookingUnit(null)}
                  className="flex-1 py-3 rounded-xl border border-slate-800 text-slate-400 hover:text-slate-200 text-xs font-mono transition-colors"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono text-xs font-bold shadow-lg shadow-emerald-500/30 transition-all hover:scale-105"
                >
                  Gửi Đơn Đặt Lịch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Commute Simulator Modal */}
      {activeCommuteUnit && (
        <CommuteSimulatorModal
          unit={activeCommuteUnit}
          isOpen={!!activeCommuteUnit}
          onClose={() => setActiveCommuteUnit(null)}
        />
      )}

      {/* Deposit Escrow Safety Flow Modal */}
      {activeEscrowUnit && (
        <DepositEscrowModal
          unit={activeEscrowUnit}
          isOpen={!!activeEscrowUnit}
          onClose={() => setActiveEscrowUnit(null)}
          onConfirmEscrow={() => {
            showToast('success', 'Đã bảo chứng tiền cọc', `Tiền cọc căn ${activeEscrowUnit.name || activeEscrowUnit.id} đã được khóa bảo vệ bởi HAVEN Escrow.`);
          }}
        />
      )}

      {/* 360 Virtual Tour Modal */}
      {activeVirtualTourUnit && (
        <VirtualTourModal
          unit={activeVirtualTourUnit}
          isOpen={!!activeVirtualTourUnit}
          onClose={() => setActiveVirtualTourUnit(null)}
        />
      )}

      {/* Landlord Profile Full Modal */}
      {activeLandlordProfile && (
        <LandlordProfileModal
          landlord={activeLandlordProfile}
          units={units}
          isOpen={!!activeLandlordProfile}
          onClose={() => setActiveLandlordProfile(null)}
          onSelectUnit={(id) => {
            setSelectedUnitId(id);
            setActiveModule('user_detail');
          }}
          onOpenChat={() => setActiveChatUnit(currentUnit)}
        />
      )}

      {/* Smart Listing Creator Modal (AI Powered) */}
      {isSmartListingOpen && (
        <SmartListingCreatorModal
          isOpen={isSmartListingOpen}
          onClose={() => setIsSmartListingOpen(false)}
          onListingCreated={(newUnit) => {
            const created = ApartmentStore.addUnit({
              floor: 8,
              unitNumber: '802',
              type: 'Executive Suite',
              sqm: newUnit.sqm || 85,
              bedrooms: newUnit.bedrooms || 2,
              bathrooms: 2,
              status: 'vacant',
              monthlyRentUSD: Math.round((newUnit.monthlyRentVND || 18000000) / 25000),
              monthlyRentVND: newUnit.monthlyRentVND || 18000000,
              city: newUnit.city || 'Ho Chi Minh City',
              district: newUnit.district || 'Quận 7',
              name: newUnit.name || 'Căn Hộ Đăng Mới AI',
              images: [
                'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=1000',
                'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&q=80&w=1000'
              ],
              hasCarParking: true,
              hasMotorbikeParking: true,
              hasElevator: true,
              hasBackupPower: true,
              floodingRisk: 'Low',
              noiseLevel: 'Quiet',
              trafficDensity: 'Low',
              petFriendly: true,
              furnished: true,
              balcony: true,
              airConditioning: true,
              washingMachine: true,
              kitchen: true,
              wifi: true,
              rating: 4.9,
              reviewCount: 1,
              viewType: 'City View',
              isVerifiedPlus: true,
              sensors: {
                smartLockBattery: 95,
                hvacStatus: 'Optimal',
                targetTempC: 24,
                energyConsumptionKwh: 120,
                waterUsageLiters: 450,
                securityAlarmDisarmed: true
              },
              environmentalData: {
                weatherNotes: 'Đón gió mát, không nắng gắt.',
                floodNotes: 'Đường cao ráo, hệ thống thoát nước hoàn chỉnh.',
                powerNotes: 'Trạm biến áp riêng.',
                trafficNotes: 'Gần đường lớn, không tắc nghẽn.'
              },
              aiInsights: {
                whyFit: ['Vị trí đắc địa', 'Chuẩn an toàn PCCC'],
                worthConsidering: ['Nên đăng ký chỗ gửi ô tô sớm']
              }
            });
            setUnits(ApartmentStore.getUnits());
            showToast('success', 'Đã xuất bản tin đăng AI', `Căn hộ "${created.name}" đã được đưa lên sàn.`);
          }}
        />
      )}

      {/* ISOLATED DEVELOPER PREVIEW SYSTEM */}
      <DevPreviewLauncher currentView={isAdminView ? 'admin' : 'user'} />

      {/* Mobile Bottom Navigation */}
      <MobileNav
        isAdminView={isAdminView}
        activeModule={activeModule}
        onNavigate={setActiveModule}
        savedCount={savedUnitIds.length}
        pendingLeadsCount={pendingLeadsCount}
      />
    </div>
  );
}

export default App;
