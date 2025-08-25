import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle } from 'lucide-react';
import { getWallet } from '@/features/crypto/store';
import { placeOrder, getQuote } from '@/features/crypto/trade';
import { canPlaceOrder } from '@/features/crypto/policy';
import type { Wallet, Asset } from '@/features/crypto/types';
import { useParams } from 'react-router-dom';

export default function TradePanel() {
  const { walletId } = useParams<{ walletId: string }>();
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [loading, setLoading] = useState(true);
  const [trading, setTrading] = useState(false);
  const [quote, setQuote] = useState<{ price: number; timestamp: string } | null>(null);
  
  const [orderForm, setOrderForm] = useState({
    side: 'buy' as 'buy' | 'sell',
    asset: 'BTC' as Asset,
    qty: 0,
    orderType: 'market' as 'market' | 'limit',
    limitPrice: 0
  });

  const tradingEnabled = import.meta.env.VITE_CRYPTO_TRADE_ENABLED === 'true';

  useEffect(() => {
    if (walletId) {
      loadWallet();
    }
  }, [walletId]);

  useEffect(() => {
    if (orderForm.asset && orderForm.qty > 0) {
      fetchQuote();
    }
  }, [orderForm.asset, orderForm.qty, orderForm.side]);

  const loadWallet = async () => {
    try {
      if (!walletId) return;
      const walletData = await getWallet(walletId);
      setWallet(walletData || null);
    } catch (error) {
      console.error('Failed to load wallet:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchQuote = async () => {
    try {
      const quoteData = await getQuote(orderForm.asset, orderForm.side, orderForm.qty);
      setQuote(quoteData);
    } catch (error) {
      console.error('Failed to fetch quote:', error);
    }
  };

  const handleTrade = async () => {
    if (!wallet || !quote) return;
    
    setTrading(true);
    try {
      const price = orderForm.orderType === 'market' ? quote.price : orderForm.limitPrice;
      const result = await placeOrder({
        wallet,
        side: orderForm.side,
        asset: orderForm.asset,
        qty: orderForm.qty,
        price
      });
      
      if (result.ok) {
        console.log('Order placed successfully:', result.orderId);
        // Reset form
        setOrderForm(prev => ({ ...prev, qty: 0 }));
      } else {
        console.error('Order failed:', result.reason);
      }
    } catch (error) {
      console.error('Trade failed:', error);
    } finally {
      setTrading(false);
    }
  };

  const policyCheck = wallet ? canPlaceOrder(
    wallet, 
    orderForm.asset, 
    orderForm.qty * (quote?.price || 0)
  ) : { ok: false, reason: 'no_wallet' };

  if (!tradingEnabled) {
    return (
      <div className="container mx-auto p-6">
        <Alert>
          <AlertTriangle className="w-4 h-4" />
          <AlertDescription>
            Trading is currently disabled. Enable CRYPTO_TRADE_ENABLED=true to access trading features.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">Loading trading panel...</div>
      </div>
    );
  }

  if (!wallet) {
    return (
      <div className="container mx-auto p-6">
        <Alert>
          <AlertTriangle className="w-4 h-4" />
          <AlertDescription>
            Wallet not found or you don't have access to trade with this wallet.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (wallet.exchange?.scopes !== 'trade') {
    return (
      <div className="container mx-auto p-6">
        <Alert>
          <AlertTriangle className="w-4 h-4" />
          <AlertDescription>
            This wallet doesn't have trading permissions. Update your exchange connection to enable trading.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const estimatedTotal = orderForm.qty * (quote?.price || 0);

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Trade Panel</h1>
        <p className="text-muted-foreground">
          Trading with {wallet.label} ({wallet.exchange?.name})
        </p>
      </div>

      {/* Policy Gates Display */}
      {wallet.policy && (
        <Card>
          <CardHeader>
            <CardTitle>Active Policy Gates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {wallet.policy.maxUsdPerDay && (
                <div className="text-center p-3 bg-muted rounded">
                  <div className="font-medium">Daily Limit</div>
                  <div className="text-sm text-muted-foreground">
                    ${wallet.policy.maxUsdPerDay.toLocaleString()}
                  </div>
                </div>
              )}
              {wallet.policy.whitelist && (
                <div className="text-center p-3 bg-muted rounded">
                  <div className="font-medium">Whitelisted Assets</div>
                  <div className="text-sm text-muted-foreground">
                    {wallet.policy.whitelist.join(', ')}
                  </div>
                </div>
              )}
              {wallet.policy.approvals && (
                <div className="text-center p-3 bg-muted rounded">
                  <div className="font-medium">Required Approvals</div>
                  <div className="text-sm text-muted-foreground">
                    {wallet.policy.approvals}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Trading Form */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Order Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {orderForm.side === 'buy' ? (
                <TrendingUp className="w-5 h-5 text-green-500" />
              ) : (
                <TrendingDown className="w-5 h-5 text-red-500" />
              )}
              {orderForm.side === 'buy' ? 'Buy' : 'Sell'} Order
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Side Selection */}
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant={orderForm.side === 'buy' ? 'default' : 'outline'}
                onClick={() => setOrderForm(prev => ({ ...prev, side: 'buy' }))}
                className="gap-2"
              >
                <TrendingUp className="w-4 h-4" />
                Buy
              </Button>
              <Button
                variant={orderForm.side === 'sell' ? 'default' : 'outline'}
                onClick={() => setOrderForm(prev => ({ ...prev, side: 'sell' }))}
                className="gap-2"
              >
                <TrendingDown className="w-4 h-4" />
                Sell
              </Button>
            </div>

            {/* Asset Selection */}
            <div>
              <Label>Asset</Label>
              <Select value={orderForm.asset} onValueChange={(value: Asset) => 
                setOrderForm(prev => ({ ...prev, asset: value }))
              }>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BTC">Bitcoin (BTC)</SelectItem>
                  <SelectItem value="ETH">Ethereum (ETH)</SelectItem>
                  <SelectItem value="USDC">USD Coin (USDC)</SelectItem>
                  <SelectItem value="USDT">Tether (USDT)</SelectItem>
                  <SelectItem value="SOL">Solana (SOL)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Quantity */}
            <div>
              <Label>Quantity</Label>
              <Input
                type="number"
                step="0.000001"
                min="0"
                value={orderForm.qty}
                onChange={(e) => setOrderForm(prev => ({ ...prev, qty: Number(e.target.value) }))}
                placeholder="0.001"
              />
            </div>

            {/* Order Type */}
            <div>
              <Label>Order Type</Label>
              <Select value={orderForm.orderType} onValueChange={(value: 'market' | 'limit') => 
                setOrderForm(prev => ({ ...prev, orderType: value }))
              }>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="market">Market Order</SelectItem>
                  <SelectItem value="limit">Limit Order</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Limit Price */}
            {orderForm.orderType === 'limit' && (
              <div>
                <Label>Limit Price (USD)</Label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  value={orderForm.limitPrice}
                  onChange={(e) => setOrderForm(prev => ({ ...prev, limitPrice: Number(e.target.value) }))}
                  placeholder="45000"
                />
              </div>
            )}

            {/* Policy Check Result */}
            {orderForm.qty > 0 && (
              <Alert>
                {policyCheck.ok ? (
                  <>
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <AlertDescription>Order passes all policy gates</AlertDescription>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-4 h-4 text-red-500" />
                    <AlertDescription>
                      Policy violation: {policyCheck.reason}
                    </AlertDescription>
                  </>
                )}
              </Alert>
            )}

            {/* Place Order Button */}
            <Button
              onClick={handleTrade}
              disabled={trading || !policyCheck.ok || orderForm.qty <= 0}
              className="w-full"
              size="lg"
            >
              {trading ? 'Placing Order...' : `${orderForm.side.toUpperCase()} ${orderForm.asset}`}
            </Button>
          </CardContent>
        </Card>

        {/* Order Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {quote && orderForm.qty > 0 && (
              <>
                <div className="flex justify-between">
                  <span>Asset:</span>
                  <Badge variant="outline">{orderForm.asset}</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Quantity:</span>
                  <span>{orderForm.qty.toFixed(6)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Price:</span>
                  <span>${quote.price.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Order Type:</span>
                  <Badge>{orderForm.orderType}</Badge>
                </div>
                <hr />
                <div className="flex justify-between font-medium">
                  <span>Estimated Total:</span>
                  <span>${estimatedTotal.toLocaleString()}</span>
                </div>
                <div className="text-xs text-muted-foreground">
                  Quote updated: {new Date(quote.timestamp).toLocaleTimeString()}
                </div>
              </>
            )}

            {(!quote || orderForm.qty <= 0) && (
              <div className="text-center text-muted-foreground">
                Enter quantity to see order summary
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}