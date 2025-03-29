
import { ApiIntegrationTestResult } from './types';

export const testApiIntegrations = (): ApiIntegrationTestResult[] => {
  // In a real app, would actually ping these services and verify connections
  return [
    {
      service: "FINIAT",
      endpoint: "/api/data-sync",
      responseTime: 245,
      status: "success",
      message: "Connection successful with normal response time",
      authStatus: "valid"
    },
    {
      service: "ADVYZON",
      endpoint: "/api/portfolio-data",
      responseTime: 189,
      status: "success",
      message: "Connection successful with normal response time",
      authStatus: "valid"
    },
    {
      service: "GHL",
      endpoint: "/api/marketing-automation",
      responseTime: 678,
      status: "warning",
      message: "Connection successful but with higher than expected response time",
      authStatus: "valid"
    },
    {
      service: "Microsoft Azure",
      endpoint: "/api/identity",
      responseTime: 210,
      status: "success",
      message: "Connection successful with normal response time",
      authStatus: "valid"
    },
    {
      service: "Stripe",
      endpoint: "/v1/customers",
      responseTime: 156,
      status: "success",
      message: "Connection successful with normal response time",
      authStatus: "valid"
    },
    {
      service: "Plaid",
      endpoint: "/api/accounts/balance",
      responseTime: 876,
      status: "warning",
      message: "Connection successful but with higher than expected response time",
      authStatus: "valid"
    },
    {
      service: "RIGHT CAPITAL",
      endpoint: "/api/financial-plans",
      responseTime: 345,
      status: "success",
      message: "Connection successful with normal response time",
      authStatus: "valid"
    },
    {
      service: "RETIREMENT ANALYZER",
      endpoint: "/api/projections",
      responseTime: 432,
      status: "success",
      message: "Connection successful with normal response time",
      authStatus: "valid"
    },
    {
      service: "Catchlight",
      endpoint: "/api/prospect-insights",
      responseTime: 267,
      status: "success",
      message: "Connection successful with normal response time",
      authStatus: "valid"
    },
    {
      service: "Tax Software Integration",
      endpoint: "/api/tax-forms",
      responseTime: 0,
      status: "error",
      message: "Connection failed - service unavailable or invalid credentials",
      authStatus: "invalid"
    }
  ];
};
