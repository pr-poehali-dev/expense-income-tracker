import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import Icon from '@/components/ui/icon';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';

interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  description: string;
  date: string;
}

interface Category {
  id: string;
  name: string;
  limit: number;
  spent: number;
  icon: string;
  color: string;
}

const Index = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: '1', type: 'income', amount: 75000, category: 'Зарплата', description: 'Зарплата за октябрь', date: '2025-10-01' },
    { id: '2', type: 'expense', amount: 15000, category: 'Продукты', description: 'Супермаркет', date: '2025-10-15' },
    { id: '3', type: 'expense', amount: 3500, category: 'Транспорт', description: 'Метро', date: '2025-10-16' },
    { id: '4', type: 'expense', amount: 8000, category: 'Развлечения', description: 'Кино и кафе', date: '2025-10-20' },
  ]);

  const [categories, setCategories] = useState<Category[]>([
    { id: '1', name: 'Продукты', limit: 25000, spent: 15000, icon: 'ShoppingCart', color: 'text-orange-500' },
    { id: '2', name: 'Транспорт', limit: 8000, spent: 3500, icon: 'Car', color: 'text-blue-500' },
    { id: '3', name: 'Развлечения', limit: 15000, spent: 8000, icon: 'Sparkles', color: 'text-purple-500' },
    { id: '4', name: 'Коммунальные', limit: 12000, spent: 0, icon: 'Home', color: 'text-green-500' },
  ]);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newTransaction, setNewTransaction] = useState({
    type: 'expense',
    amount: '',
    category: '',
    description: '',
  });

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const balance = totalIncome - totalExpenses;

  const handleAddTransaction = () => {
    const transaction: Transaction = {
      id: Date.now().toString(),
      type: newTransaction.type as 'income' | 'expense',
      amount: parseFloat(newTransaction.amount),
      category: newTransaction.category,
      description: newTransaction.description,
      date: new Date().toISOString().split('T')[0],
    };

    setTransactions([transaction, ...transactions]);

    if (transaction.type === 'expense') {
      setCategories(categories.map(cat => 
        cat.name === transaction.category 
          ? { ...cat, spent: cat.spent + transaction.amount }
          : cat
      ));
    }

    setNewTransaction({ type: 'expense', amount: '', category: '', description: '' });
    setIsAddDialogOpen(false);
  };

  const getProgressColor = (spent: number, limit: number) => {
    const percentage = (spent / limit) * 100;
    if (percentage >= 90) return 'bg-destructive';
    if (percentage >= 70) return 'bg-orange-500';
    return 'bg-success';
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Финансовый трекер</h1>
            <p className="text-muted-foreground mt-1">Управление доходами и расходами</p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button size="lg" className="gap-2">
                <Icon name="Plus" size={20} />
                Добавить
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Новая транзакция</DialogTitle>
                <DialogDescription>Добавьте доход или расход в систему учёта</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Тип</Label>
                  <Select value={newTransaction.type} onValueChange={(value) => setNewTransaction({ ...newTransaction, type: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="income">Доход</SelectItem>
                      <SelectItem value="expense">Расход</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Сумма</Label>
                  <Input 
                    type="number" 
                    placeholder="0" 
                    value={newTransaction.amount}
                    onChange={(e) => setNewTransaction({ ...newTransaction, amount: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Категория</Label>
                  <Select value={newTransaction.category} onValueChange={(value) => setNewTransaction({ ...newTransaction, category: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите категорию" />
                    </SelectTrigger>
                    <SelectContent>
                      {newTransaction.type === 'income' ? (
                        <>
                          <SelectItem value="Зарплата">Зарплата</SelectItem>
                          <SelectItem value="Фриланс">Фриланс</SelectItem>
                          <SelectItem value="Инвестиции">Инвестиции</SelectItem>
                        </>
                      ) : (
                        categories.map(cat => (
                          <SelectItem key={cat.id} value={cat.name}>{cat.name}</SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Описание</Label>
                  <Input 
                    placeholder="Описание транзакции" 
                    value={newTransaction.description}
                    onChange={(e) => setNewTransaction({ ...newTransaction, description: e.target.value })}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Отмена</Button>
                <Button onClick={handleAddTransaction}>Добавить</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card className="animate-scale-in">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Баланс</CardTitle>
              <Icon name="Wallet" className="text-primary" size={20} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{balance.toLocaleString('ru-RU')} ₽</div>
              <p className="text-xs text-muted-foreground mt-1">Текущий остаток средств</p>
            </CardContent>
          </Card>

          <Card className="animate-scale-in" style={{ animationDelay: '0.1s' }}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Доходы</CardTitle>
              <Icon name="TrendingUp" className="text-success" size={20} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-success">{totalIncome.toLocaleString('ru-RU')} ₽</div>
              <p className="text-xs text-muted-foreground mt-1">За текущий месяц</p>
            </CardContent>
          </Card>

          <Card className="animate-scale-in" style={{ animationDelay: '0.2s' }}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Расходы</CardTitle>
              <Icon name="TrendingDown" className="text-destructive" size={20} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-destructive">{totalExpenses.toLocaleString('ru-RU')} ₽</div>
              <p className="text-xs text-muted-foreground mt-1">За текущий месяц</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="limits" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="limits">
              <Icon name="Target" size={16} className="mr-2" />
              Лимиты категорий
            </TabsTrigger>
            <TabsTrigger value="transactions">
              <Icon name="Receipt" size={16} className="mr-2" />
              История транзакций
            </TabsTrigger>
          </TabsList>

          <TabsContent value="limits" className="space-y-4 mt-6">
            <div className="grid gap-4 md:grid-cols-2">
              {categories.map((category) => {
                const percentage = (category.spent / category.limit) * 100;
                const remaining = category.limit - category.spent;
                
                return (
                  <Card key={category.id} className="animate-fade-in">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-muted">
                            <Icon name={category.icon as any} className={category.color} size={24} />
                          </div>
                          <div>
                            <CardTitle className="text-lg">{category.name}</CardTitle>
                            <CardDescription>
                              {category.spent.toLocaleString('ru-RU')} / {category.limit.toLocaleString('ru-RU')} ₽
                            </CardDescription>
                          </div>
                        </div>
                        <Badge variant={percentage >= 90 ? 'destructive' : percentage >= 70 ? 'default' : 'outline'}>
                          {percentage.toFixed(0)}%
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <Progress 
                        value={percentage} 
                        className="h-2"
                        indicatorClassName={getProgressColor(category.spent, category.limit)}
                      />
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Осталось</span>
                        <span className={`font-medium ${remaining < 0 ? 'text-destructive' : 'text-success'}`}>
                          {remaining.toLocaleString('ru-RU')} ₽
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="transactions" className="space-y-4 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Последние операции</CardTitle>
                <CardDescription>История всех доходов и расходов</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {transactions.map((transaction) => (
                    <div 
                      key={transaction.id} 
                      className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`p-2 rounded-lg ${transaction.type === 'income' ? 'bg-success/10' : 'bg-destructive/10'}`}>
                          <Icon 
                            name={transaction.type === 'income' ? 'ArrowDown' : 'ArrowUp'} 
                            className={transaction.type === 'income' ? 'text-success' : 'text-destructive'}
                            size={20}
                          />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{transaction.description}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">{transaction.category}</Badge>
                            <span className="text-xs text-muted-foreground">{transaction.date}</span>
                          </div>
                        </div>
                      </div>
                      <div className={`text-lg font-semibold ${transaction.type === 'income' ? 'text-success' : 'text-destructive'}`}>
                        {transaction.type === 'income' ? '+' : '-'}{transaction.amount.toLocaleString('ru-RU')} ₽
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
