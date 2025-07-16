import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useCreditCards } from '@/context/CreditCardsContext';
import { CreditCard, Calendar, DollarSign, AlertCircle, Edit, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

const getCreditUtilization = (balance: number, limit: number) => {
  if (limit === 0) return 0;
  return (balance / limit) * 100;
};

const getUtilizationColor = (utilization: number) => {
  if (utilization < 30) return 'bg-success';
  if (utilization < 70) return 'bg-warning';
  return 'bg-destructive';
};

const getIssuerLogo = (issuer: string) => {
  // In a real app, you would return actual logo URLs
  const logos: { [key: string]: string } = {
    'Chase': '🏦',
    'American Express': '💳',
    'Citi': '🏛️',
    'Capital One': '💼',
    'Discover': '🔍',
    'Bank of America': '🏦',
    'Wells Fargo': '🐎',
    'US Bank': '🏦',
    'Barclays': '🏦',
    'Synchrony': '💳',
  };
  return logos[issuer] || '💳';
};

export const CreditCardsList: React.FC = () => {
  const { creditCards, loading, error } = useCreditCards();

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(2)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-muted rounded"></div>
                  <div>
                    <div className="w-32 h-4 bg-muted rounded mb-1"></div>
                    <div className="w-24 h-3 bg-muted rounded"></div>
                  </div>
                </div>
                <div className="w-16 h-5 bg-muted rounded"></div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="w-full h-2 bg-muted rounded"></div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="w-full h-12 bg-muted rounded"></div>
                  <div className="w-full h-12 bg-muted rounded"></div>
                  <div className="w-full h-12 bg-muted rounded"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 text-destructive">
            <AlertCircle className="h-4 w-4" />
            <p>Error loading credit cards: {error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (creditCards.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <CreditCard className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No credit cards added yet</p>
            <p className="text-sm text-muted-foreground mt-2">
              Add your first credit card to start tracking balances and payments
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {creditCards.map((card) => {
        const utilization = getCreditUtilization(card.current_balance, card.credit_limit);
        const availableCredit = card.credit_limit - card.current_balance;
        const isDueSoon = card.due_date && new Date(card.due_date) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        
        return (
          <Card key={card.id} className="relative">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{getIssuerLogo(card.issuer)}</div>
                  <div>
                    <CardTitle className="text-lg">{card.name}</CardTitle>
                    <CardDescription className="flex items-center gap-2">
                      {card.issuer} •••• {card.last_four}
                      {card.is_plaid_linked && (
                        <Badge variant="secondary" className="text-xs">
                          Synced
                        </Badge>
                      )}
                    </CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {isDueSoon && (
                    <Badge variant="outline" className="text-warning border-warning">
                      Due Soon
                    </Badge>
                  )}
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Credit Utilization */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Credit Utilization</span>
                    <span className={utilization > 70 ? 'text-destructive' : utilization > 30 ? 'text-warning' : 'text-success'}>
                      {utilization.toFixed(1)}%
                    </span>
                  </div>
                  <Progress 
                    value={utilization} 
                    className="h-2" 
                    // @ts-ignore - className will be applied correctly
                    indicatorClassName={getUtilizationColor(utilization)}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Used: {formatCurrency(card.current_balance)}</span>
                    <span>Available: {formatCurrency(availableCredit)}</span>
                  </div>
                </div>

                {/* Account Details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm font-medium flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      Balance
                    </p>
                    <p className="text-2xl font-bold">{formatCurrency(card.current_balance)}</p>
                    <p className="text-xs text-muted-foreground">
                      Statement: {formatCurrency(card.statement_balance)}
                    </p>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-sm font-medium flex items-center gap-2">
                      <CreditCard className="h-4 w-4" />
                      Credit Limit
                    </p>
                    <p className="text-2xl font-bold">{formatCurrency(card.credit_limit)}</p>
                    <p className="text-xs text-muted-foreground">
                      APR: {card.apr}%
                    </p>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-sm font-medium flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Payment Due
                    </p>
                    <p className="text-2xl font-bold">{formatCurrency(card.minimum_payment)}</p>
                    {card.due_date && (
                      <p className={`text-xs ${isDueSoon ? 'text-warning' : 'text-muted-foreground'}`}>
                        Due: {format(new Date(card.due_date), 'MMM d')}
                      </p>
                    )}
                  </div>
                </div>

                {/* Rewards Program */}
                {card.rewards_program && (
                  <div className="pt-2 border-t">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {card.rewards_program}
                      </Badge>
                      <span className="text-xs text-muted-foreground">Rewards Program</span>
                    </div>
                  </div>
                )}

                {/* Notes */}
                {card.notes && (
                  <div className="pt-2 border-t">
                    <p className="text-sm text-muted-foreground">
                      {card.notes}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};