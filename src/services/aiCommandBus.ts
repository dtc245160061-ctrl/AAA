import { useEffect } from 'react';
import type { ContractFormAutoFillPayload, ListingFormAutoFillPayload } from './aiOcrAndFormService';

export type AiCommandType = 
  | 'apply_filters' 
  | 'compare_units' 
  | 'open_unit_detail' 
  | 'navigate_module'
  | 'draft_contract'
  | 'fill_listing'
  | 'reconcile_payments'
  | 'collect_debts'
  | 'scan_iot_leaks'
  | 'moderate_marketplace'
  | 'scan_contract_traps'
  | 'audit_pccc'
  | 'open_negotiation_war_room'
  | 'optimize_unit_yield';

export interface ApplyFiltersPayload {
  city?: string;
  district?: string;
  bedrooms?: number;
  minRentVND?: number;
  maxRentVND?: number;
  minFloor?: number;
  filterMode?: 'baseRent' | 'trueCost';
  carParkingOnly?: boolean;
  lowFloodOnly?: boolean;
  backupPowerOnly?: boolean;
  petFriendlyOnly?: boolean;
  pcccCertifiedOnly?: boolean;
  verifiedLandlordOnly?: boolean;
  queryText?: string;
  summaryBadge?: string;
  matchingCount?: number;
}

export interface CompareUnitsPayload {
  unitIds: string[];
  summaryBadge?: string;
}

export interface OpenUnitDetailPayload {
  unitId: string;
  summaryBadge?: string;
}

export interface NavigateModulePayload {
  module: string;
  summaryBadge?: string;
}

export interface ReconcilePaymentsPayload {
  rawSmsBatch?: string;
  summaryBadge?: string;
}

export interface CollectDebtsPayload {
  targetLevel?: 1 | 2 | 3;
  summaryBadge?: string;
}

export interface ScanIotLeaksPayload {
  autoCreateTickets?: boolean;
  summaryBadge?: string;
}

export interface ModerateMarketplacePayload {
  autoSweep?: boolean;
  summaryBadge?: string;
}

export interface ScanContractTrapsPayload {
  contractText?: string;
  summaryBadge?: string;
}

export interface AuditPcccPayload {
  unitId?: string;
  summaryBadge?: string;
}

export interface OpenNegotiationWarRoomPayload {
  unitId?: string;
  summaryBadge?: string;
}

export interface OptimizeUnitYieldPayload {
  unitId?: string;
  summaryBadge?: string;
}

export type AiCommand = 
  | { type: 'apply_filters'; payload: ApplyFiltersPayload }
  | { type: 'compare_units'; payload: CompareUnitsPayload }
  | { type: 'open_unit_detail'; payload: OpenUnitDetailPayload }
  | { type: 'navigate_module'; payload: NavigateModulePayload }
  | { type: 'draft_contract'; payload: ContractFormAutoFillPayload }
  | { type: 'fill_listing'; payload: ListingFormAutoFillPayload }
  | { type: 'reconcile_payments'; payload: ReconcilePaymentsPayload }
  | { type: 'collect_debts'; payload: CollectDebtsPayload }
  | { type: 'scan_iot_leaks'; payload: ScanIotLeaksPayload }
  | { type: 'moderate_marketplace'; payload: ModerateMarketplacePayload }
  | { type: 'scan_contract_traps'; payload: ScanContractTrapsPayload }
  | { type: 'audit_pccc'; payload: AuditPcccPayload }
  | { type: 'open_negotiation_war_room'; payload: OpenNegotiationWarRoomPayload }
  | { type: 'optimize_unit_yield'; payload: OptimizeUnitYieldPayload };

type AiCommandListener = (command: AiCommand) => void;

/**
 * Autonomous UI Action Bus for Haven
 * Enables zero-click programmatic UI manipulation (auto-filtering, navigation, unit comparison)
 * triggered directly from Local Qwen 7B SLM or deterministic natural language query parsing.
 */
class AiCommandBus {
  private listeners: Set<AiCommandListener> = new Set();

  public subscribe(listener: AiCommandListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  public emit(command: AiCommand): void {
    this.listeners.forEach(listener => {
      try {
        listener(command);
      } catch (err) {
        console.error('Error executing AI command listener:', err);
      }
    });
  }

  public applyFilters(payload: ApplyFiltersPayload): void {
    this.emit({ type: 'apply_filters', payload });
  }

  public compareUnits(unitIds: string[], summaryBadge?: string): void {
    this.emit({ type: 'compare_units', payload: { unitIds, summaryBadge } });
  }

  public openUnitDetail(unitId: string, summaryBadge?: string): void {
    this.emit({ type: 'open_unit_detail', payload: { unitId, summaryBadge } });
  }

  public navigateModule(module: string, summaryBadge?: string): void {
    this.emit({ type: 'navigate_module', payload: { module, summaryBadge } });
  }

  public draftContract(payload: ContractFormAutoFillPayload, summaryBadge?: string): void {
    this.emit({ type: 'draft_contract', payload: { ...payload, summaryBadge: summaryBadge || payload.summaryBadge } });
  }

  public fillListing(payload: ListingFormAutoFillPayload, summaryBadge?: string): void {
    this.emit({ type: 'fill_listing', payload: { ...payload, summaryBadge: summaryBadge || payload.summaryBadge } });
  }

  public reconcilePayments(payload?: ReconcilePaymentsPayload, summaryBadge?: string): void {
    this.emit({ 
      type: 'reconcile_payments', 
      payload: { ...payload, summaryBadge: summaryBadge || payload?.summaryBadge || 'AI Đối Soát Chuyển Khoản Ngân Hàng' } 
    });
  }

  public collectDebts(payload?: CollectDebtsPayload, summaryBadge?: string): void {
    this.emit({ 
      type: 'collect_debts', 
      payload: { ...payload, summaryBadge: summaryBadge || payload?.summaryBadge || 'AI Chiến Dịch Thu Hồi Công Nợ Đa Tầng' } 
    });
  }

  public scanIotLeaks(payload?: ScanIotLeaksPayload, summaryBadge?: string): void {
    this.emit({ 
      type: 'scan_iot_leaks', 
      payload: { ...payload, summaryBadge: summaryBadge || payload?.summaryBadge || 'AI Giám Sát Rò Rỉ & Anomaly Radar' } 
    });
  }

  public moderateMarketplace(payload?: ModerateMarketplacePayload, summaryBadge?: string): void {
    this.emit({ 
      type: 'moderate_marketplace', 
      payload: { ...payload, summaryBadge: summaryBadge || payload?.summaryBadge || 'AI Tự Động Duyệt & Quét Bẫy Cọc Sàn' } 
    });
  }

  public scanContractTraps(payload?: ScanContractTrapsPayload, summaryBadge?: string): void {
    this.emit({
      type: 'scan_contract_traps',
      payload: { ...payload, summaryBadge: summaryBadge || payload?.summaryBadge || 'AI Quét Bẫy Hợp Đồng Thuê Nhà' }
    });
  }

  public auditPccc(unitId?: string, summaryBadge?: string): void {
    this.emit({
      type: 'audit_pccc',
      payload: { unitId, summaryBadge: summaryBadge || 'AI Kiểm Định Sinh Tồn PCCC QCVN 06' }
    });
  }

  public openNegotiationWarRoom(unitId?: string, summaryBadge?: string): void {
    this.emit({
      type: 'open_negotiation_war_room',
      payload: { unitId, summaryBadge: summaryBadge || 'AI Phòng Đấu Trí Đàm Phán Giá' }
    });
  }

  public optimizeUnitYield(unitId?: string, summaryBadge?: string): void {
    this.emit({
      type: 'optimize_unit_yield',
      payload: { unitId, summaryBadge: summaryBadge || 'AI Tối Ưu Giá Thuê & Hiệu Suất Sinh Lời' }
    });
  }
}

export const aiCommandBus = new AiCommandBus();

/**
 * React Hook for UI components to subscribe to autonomous AI commands
 */
export function useAiCommand(listener: AiCommandListener): void {
  useEffect(() => {
    return aiCommandBus.subscribe(listener);
  }, [listener]);
}
