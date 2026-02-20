export interface ScanResult {
  id?: number;
  url: string;
  risk_score: number;
  threat_level: 'Safe' | 'Suspicious' | 'Malicious';
  scan_result: {
    breakdown?: {
      blacklist: number;
      domain_age: number;
      ssl_validity: number;
      redirect_chain: number;
      ip_reputation: number;
      phishing_indicators: number;
    };
    checks: {
      dns_lookup: string;
      whois_data: string;
      ssl_status: string;
      blacklist_check: string;
      phishing_check: string;
      redirect_analysis: string;
      malware_signature: string;
      ip_reputation: string;
      suspicious_keywords: string;
      homograph_detection: string;
    };
    recommendations: string[];
    summary: string;
  };
  ai_analysis?: {
    risk_assessment: string;
    threat_details: string;
    confidence_score: number;
  };
  created_at: string;
}

export interface User {
  id: number;
  email: string;
  role: string;
}

export interface DashboardStats {
  totalScans: number;
  maliciousScans: number;
  suspiciousScans: number;
  safeScans: number;
  recentScans: ScanResult[];
  topRiskDomains: ScanResult[];
  trend: { date: string; count: number }[];
}
