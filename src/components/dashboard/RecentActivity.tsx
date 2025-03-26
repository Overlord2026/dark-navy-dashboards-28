
import { DashboardCard } from "@/components/ui/DashboardCard";

const activities = [
  {
    id: 1,
    description: "New invoice #INV-2023-004 created",
    date: "Today, 10:30 AM",
    type: "invoice"
  },
  {
    id: 2,
    description: "Payment received from Client XYZ Inc.",
    amount: "$24,500.00",
    date: "Today, 9:15 AM",
    type: "payment"
  },
  {
    id: 3,
    description: "Expense report #EXP-463 approved",
    date: "Yesterday, 5:30 PM",
    type: "expense"
  },
  {
    id: 4,
    description: "Budget for Q3 updated",
    date: "Yesterday, 2:45 PM",
    type: "budget"
  },
  {
    id: 5,
    description: "Tax filing reminder: Due in 15 days",
    date: "Yesterday, 11:20 AM",
    type: "reminder"
  }
];

export const RecentActivity = () => {
  return (
    <DashboardCard title="Recent Activity">
      <div className="space-y-4">
        {activities.map((activity) => (
          <div 
            key={activity.id} 
            className="flex items-start justify-between py-2 border-b border-border/20 last:border-0"
          >
            <div className="flex items-start space-x-3">
              <div 
                className={`h-2 w-2 mt-2 rounded-full ${
                  activity.type === 'payment' ? 'bg-green-500' : 
                  activity.type === 'invoice' ? 'bg-blue-500' : 
                  activity.type === 'expense' ? 'bg-red-500' : 
                  activity.type === 'budget' ? 'bg-purple-500' : 
                  'bg-amber-500'
                }`}
              />
              <div>
                <p className="text-sm text-white">{activity.description}</p>
                {activity.amount && (
                  <p className="text-sm font-medium text-green-500">{activity.amount}</p>
                )}
                <p className="text-xs text-muted-foreground">{activity.date}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-center mt-4">
        <a 
          href="#" 
          className="text-sm text-accent hover:text-accent/80 transition-colors"
        >
          View all activity
        </a>
      </div>
    </DashboardCard>
  );
};
