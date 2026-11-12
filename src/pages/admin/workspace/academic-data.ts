export const courses = [
  { code: "PC512", title: "Communication Skills & Technical Writing", instructor: "Purbasha Das", color: "amber" },
  { code: "PC503", title: "Programming Lab", instructor: "Ankit Vijayvargiya", color: "sky" },
  { code: "IT582", title: "Foundations of ML", instructor: "Shrimanta Mandal", color: "violet" },
  { code: "IT462", title: "Exploratory Data Analysis", instructor: "Gopinath Panda", color: "rose" },
  { code: "IT580", title: "Advanced Algorithm", instructor: "Manik Lal Das", color: "emerald" },
] as const;

export const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"] as const;
export const hours = ["8 AM", "9 AM", "10 AM", "11 AM", "12 PM", "1 PM", "2 PM", "3 PM", "4 PM", "5 PM", "6 PM"] as const;

export const timetable = [
  ["Monday", 4, 2, "IT580", "Advanced Algorithm", "Manik Lal Das", "Lab 005"],
  ["Monday", 6, 1, "IT580", "Advanced Algorithm", "Manik Lal Das", "CEP-209"],
  ["Monday", 7, 1, "IT462", "Exploratory Data Analysis", "Gopinath Panda", "CEP-209"],
  ["Tuesday", 0, 1, "PC512", "Communication Skills & Writing", "Purbasha Das", "CEP-203"],
  ["Tuesday", 4, 2, "PC503", "Programming Lab", "Ankit Vijayvargiya", "CEP-202"],
  ["Tuesday", 7, 1, "IT582", "Foundations of ML", "Shrimanta Mandal", "CEP-202"],
  ["Tuesday", 8, 1, "IT580", "Advanced Algorithm", "Manik Lal Das", "CEP-209"],
  ["Wednesday", 0, 1, "PC503", "Programming Lab", "Ankit Vijayvargiya", "CEP-202"],
  ["Wednesday", 6, 1, "IT462", "Exploratory Data Analysis", "Gopinath Panda", "CEP-209"],
  ["Thursday", 0, 2, "PC503", "Programming Lab", "Ankit Vijayvargiya", "CEP-202"],
  ["Thursday", 4, 2, "IT582", "Foundations of ML", "Shrimanta Mandal", "Lab 004"],
  ["Thursday", 6, 1, "IT582", "Foundations of ML", "Shrimanta Mandal", "CEP-202"],
  ["Thursday", 7, 1, "IT580", "Advanced Algorithm", "Manik Lal Das", "CEP-209"],
  ["Thursday", 8, 1, "IT462", "Exploratory Data Analysis", "Gopinath Panda", "CEP-209"],
  ["Thursday", 9, 2, "TA", "Basic Electronic Circuits", "Vipul Mishra", "Lab 102"],
  ["Friday", 3, 1, "PC512", "Communication Skills & Writing", "Purbasha Das", "CEP-203"],
  ["Friday", 4, 2, "IT462", "Exploratory Data Analysis", "Gopinath Panda", "CEP-202"],
  ["Friday", 8, 1, "IT582", "Foundations of ML", "Shrimanta Mandal", "CEP-202"],
  ["Friday", 9, 2, "TA", "Basic Electronic Circuits", "Vipul Mishra", "Lab 101"],
] as const;

export const colorClasses: Record<string, string> = {
  PC512: "border-amber-500/35 bg-amber-500/10 text-foreground",
  PC503: "border-sky-500/35 bg-sky-500/10 text-foreground",
  IT582: "border-violet-500/35 bg-violet-500/10 text-foreground",
  IT462: "border-rose-500/35 bg-rose-500/10 text-foreground",
  IT580: "border-emerald-500/35 bg-emerald-500/10 text-foreground",
  TA: "border-primary/40 bg-primary/10 text-foreground",
};
