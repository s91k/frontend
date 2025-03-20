import { TrendingDown, TrendingUp, MinusCircle } from 'lucide-react';
import { TrendCardInfo } from '@/types/company';

export const categoryInfo: Record<string, TrendCardInfo> = {
  decreasing: {
    title: "Companies Reducing Emissions",
    icon: TrendingDown,
    color: "bg-green-5",
    textColor: "text-green-3"
  },
  increasing: {
    title: "Companies Increasing Emissions",
    icon: TrendingUp,
    color: "bg-orange-5",
    textColor: "text-orange-3"
  },
  noComparable: {
    title: "No Comparable Data",
    icon: MinusCircle,
    color: "bg-blue-5",
    textColor: "text-blue-3"
  }
};