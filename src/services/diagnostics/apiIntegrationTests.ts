
import { ApiIntegrationTestResult } from './types';
import { v4 as uuidv4 } from 'uuid';

export const testApiIntegrations = (): ApiIntegrationTestResult[] => {
  // In a real app, would actually ping these services and verify connections
  return [
    {
      id: uuidv4(),
      service: "FINIAT",
      endpoint: "/api/data-sync",
      responseTime: 245,
      status: "success",
      message: "Connection successful with normal response time",
      authStatus: "valid"
    },
    {
      id: uuidv4(),
      service: "ADVYZON",
      endpoint: "/api/portfolio-data",
      responseTime: 189,
      status: "success",
      message: "Connection successful with normal response time",
      authStatus: "valid"
    },
    {
      id: uuidv4(),
      service: "GHL",
      endpoint: "/api/marketing-automation",
      responseTime: 678,
      status: "warning",
      message: "Connection successful but with higher than expected response time",
      authStatus: "valid"
    },
    {
      id: uuidv4(),
      service: "Microsoft Azure",
      endpoint: "/api/identity",
      responseTime: 210,
      status: "success",
      message: "Connection successful with normal response time",
      authStatus: "valid"
    },
    {
      id: uuidv4(),
      service: "Stripe",
      endpoint: "/v1/customers",
      responseTime: 156,
      status: "success",
      message: "Connection successful with normal response time",
      authStatus: "valid"
    },
    {
      id: uuidv4(),
      service: "Plaid",
      endpoint: "/api/accounts/balance",
      responseTime: 876,
      status: "warning",
      message: "Connection successful but with higher than expected response time",
      authStatus: "valid"
    },
    {
      id: uuidv4(),
      service: "RIGHT CAPITAL",
      endpoint: "/api/financial-plans",
      responseTime: 345,
      status: "success",
      message: "Connection successful with normal response time",
      authStatus: "valid"
    },
    {
      id: uuidv4(),
      service: "RETIREMENT ANALYZER",
      endpoint: "/api/projections",
      responseTime: 432,
      status: "success",
      message: "Connection successful with normal response time",
      authStatus: "valid"
    },
    {
      id: uuidv4(),
      service: "Catchlight",
      endpoint: "/api/prospect-insights",
      responseTime: 267,
      status: "success",
      message: "Connection successful with normal response time",
      authStatus: "valid"
    },
    {
      id: uuidv4(),
      service: "Tax Software Integration",
      endpoint: "/api/tax-forms",
      responseTime: 0,
      status: "error",
      message: "Connection failed - service unavailable or invalid credentials",
      authStatus: "invalid"
    }
  ];
};
