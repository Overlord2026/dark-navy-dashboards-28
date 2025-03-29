
export const getAuthStatusBadge = (status: string) => {
  switch (status) {
    case 'valid':
      return <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200">Valid</span>;
    case 'expired':
      return <span className="text-xs px-2 py-1 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200">Expired</span>;
    case 'invalid':
      return <span className="text-xs px-2 py-1 rounded-full bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200">Invalid</span>;
    default:
      return <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-200">Not Tested</span>;
  }
};

export const getResponseTimeBadge = (time: number) => {
  if (time === 0) {
    return <span className="text-xs px-2 py-1 rounded-full bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200">Timeout</span>;
  } else if (time < 300) {
    return <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200">{time}ms</span>;
  } else if (time < 600) {
    return <span className="text-xs px-2 py-1 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200">{time}ms</span>;
  } else {
    return <span className="text-xs px-2 py-1 rounded-full bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200">{time}ms</span>;
  }
};

export const getAccessStatusBadge = (status: string) => {
  switch (status) {
    case 'granted':
      return <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200">Access Granted</span>;
    case 'denied':
      return <span className="text-xs px-2 py-1 rounded-full bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200">Access Denied</span>;
    case 'error':
      return <span className="text-xs px-2 py-1 rounded-full bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200">Test Error</span>;
    default:
      return <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-200">Not Tested</span>;
  }
};
