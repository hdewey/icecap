export function timeSince(date: Date) {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  
  const intervals = [
    { name: 'year', duration: 31536000 },
    { name: 'month', duration: 2592000 },
    { name: 'day', duration: 86400 },
    { name: 'hour', duration: 3600 },
    { name: 'minute', duration: 60 }
  ];

  for (let i = 0; i < intervals.length; i++) {
    const currentInterval = seconds / intervals[i].duration;
    if (currentInterval >= 1) {
      const value = Math.floor(currentInterval);
      return `edited ${value} ${intervals[i].name}${value !== 1 ? 's' : ''} ago`;
    }
  }

  return "edited " + Math.floor(seconds) + " seconds ago";
}

export function convertUnixTimestampToDate(unixTimestamp: number) {
  const date = new Date(unixTimestamp * 1000); 
  return `${date.toDateString()} ${date.toTimeString().split(' ')[0]}`; 
}
