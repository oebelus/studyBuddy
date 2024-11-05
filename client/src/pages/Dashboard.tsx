import { useEffect, useState } from "react";
import Navbar from "../components/dashboard/Navbar";
import Sidebar from "../components/dashboard/Sidebar";
import { BarChart, PieChart, LineChart, TrendingUp } from 'lucide-react';
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart as RechartsBarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell
} from 'recharts';
import { MCQs } from "../types/mcq";
import { axiosInstance } from "../services/auth.service";
import { jwtDecode } from "jwt-decode";
import { Stat } from "../types/Attempts";
import { Flashcards } from "../types/flashcard";

interface WeeklyData {
  timestamp: Date;
  score: number;
  questionsAttempted: number;
  correctAnswers: number;
  wrongAnswers: number;
}

interface CategoryStat {
  name: string;
  avgScore: number;
  attempts: number;
  correctAnswers: number;
  wrongAnswers: number;
}

interface DifficultyStats {
  easy: number;
  medium: number;
  hard: number;
}

export default function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [questionsCount, setQuestionsCount] = useState<number>(0);
  const [decksCount, setDecksCount] = useState<number>(0);
  const [answeredQuestionsCount, setAnsweredQuestionsCount] = useState<number>(0);
  const [averageScore, setAverageScore] = useState<number>(0);
  const [correctAnswersCount, setCorrectAnswersCount] = useState<number>(0);
  const [incorrectAnswersCount, setIncorrectAnswersCount] = useState<number>(0);
  const [currentStreak, setCurrentStreak] = useState<number>(0);
  const [streakMessage, setStreakMessage] = useState<string>("");
  const [flashcardsCreated, setFlashcardsCreated] = useState<number>(0);
  const [weeklyData, setWeeklyData] = useState<WeeklyData[]>([]);
  const [categoryData, setCategoryData] = useState<CategoryStat[]>([]);
  const [difficultyStats, setDifficultyStats] = useState<DifficultyStats>({ easy: 0, medium: 0, hard: 0 });

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
    
  useEffect(() => {
    axiosInstance.get(`/quiz/mcq`)
      .then((response) => { 
        const count = response.data.mcq.reduce((acc: number, mcq: MCQs) => mcq.mcqs.length + acc, 0);
        setQuestionsCount(count);
        setDecksCount(response.data.mcq.length);
    })
      .catch((error) => { console.error(error); });

    axiosInstance.get(`/quiz/flashcard`)
      .then((response) => { 
        const length = response.data.flashcard.reduce((acc: number, flashcard: Flashcards) => flashcard.flashcards.length + acc, 0);
        setFlashcardsCreated(length);
    })
      .catch((error) => { console.error(error); });
  }, []);

  useEffect(() => {
    const refreshToken = JSON.stringify(localStorage.getItem('refreshToken'));
    
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const userId = jwtDecode(refreshToken).id;
    axiosInstance.get(`/attempt/user/${userId}`)
      .then((response) => {
        console.log(response.data)
        const { 
          weeklyData,
          categoryData,
          answered,
          totalCorrectAnswers,
          totalWrongAnswers,
          currentStreak
        } = response.data;
        
        if (questionsCount && questionsCount > 0) {
          const averageScore = response.data.categoryData.reduce((acc: number, stat: Stat) => stat.avgScore + acc, 0) / questionsCount;
          setAverageScore(parseFloat(averageScore.toFixed(2)));
        }
        
        setAnsweredQuestionsCount(answered);
        setCorrectAnswersCount(totalCorrectAnswers);
        setIncorrectAnswersCount(totalWrongAnswers);
        setCurrentStreak(currentStreak);

        const processedWeeklyData = weeklyData.map((data: WeeklyData) => ({
          ...data,
          timestamp: new Date(data.timestamp).toLocaleDateString(),
        }));
        
        setWeeklyData(processedWeeklyData);
        setCategoryData(categoryData);

        if (categoryData.length > 0) {
          const avgScore = categoryData.reduce(
            (acc: number, stat: CategoryStat) => acc + (stat.avgScore * stat.attempts),
            0
          ) / categoryData.reduce((acc: number, stat: CategoryStat) => acc + stat.attempts, 0);
          setAverageScore(parseFloat(avgScore.toFixed(2)));
        }

        setStreakMessage(currentStreak > 0 ? "Keep it up!" : "Restore your streak!");
        
    }).catch((error) => { console.error(error); });
  }, [currentStreak, questionsCount]);
 
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Sample data
  const stats = {
    totalQuestions: questionsCount,
    questionsAnswered: answeredQuestionsCount || 0,
    correctAnswers: correctAnswersCount || 0,
    incorrectAnswers: incorrectAnswersCount || 0,
    flashcardsCreated: flashcardsCreated || 0,
    averageScore: averageScore,
    streak: currentStreak
  };

  // Transform weekly data for the chart
  const formattedWeeklyData = weeklyData.map(data => ({
    name: new Date(data.timestamp).toLocaleDateString('en-US', { weekday: 'short' }),
    questions: data.questionsAttempted,
    correct: data.correctAnswers
  }));

  // Transform category data for the pie chart
  const formattedCategoryData = categoryData.map(category => ({
    name: category.name,
    value: category.attempts
  }));


  const formattedDifficultyData = [
    { difficulty: 'Easy', count: difficultyStats.easy },
    { difficulty: 'Medium', count: difficultyStats.medium },
    { difficulty: 'Hard', count: difficultyStats.hard }
  ];

  return (
    <div className="dark:bg-[#111111] bg-white min-h-screen">
      <Navbar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="flex h-screen pt-16">
        <Sidebar isSidebarOpen={isSidebarOpen} />
        <main 
          className={`flex-1 overflow-x-hidden overflow-y-auto bg-white dark:bg-[#111111] transition-all duration-300 ease-in-out ${
            isSidebarOpen ? 'ml-64' : 'ml-0'
          }`}
        >
          <div className="container mx-auto px-6 py-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="dark:bg-[#1F2937] bg-white p-6 rounded-lg shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium dark:text-gray-100">Total Questions</h3>
                  <BarChart className="h-4 w-4 text-blue-500" />
                </div>
                <p className="text-2xl font-bold dark:text-gray-100">{stats.totalQuestions}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{decksCount} decks created</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{stats.questionsAnswered} {stats.questionsAnswered === 1 ? 'question' : 'questions'} answered</p>
              </div>

              <div className="dark:bg-[#1F2937] bg-white p-6 rounded-lg shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium dark:text-gray-100">Average Score</h3>
                  <TrendingUp className="h-4 w-4 text-green-500" />
                </div>
                <p className="text-2xl font-bold dark:text-gray-100">{stats.averageScore}%</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{stats.correctAnswers} {stats.correctAnswers === 1 ? 'correct answer' : 'correct answers'}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{stats.incorrectAnswers} {stats.incorrectAnswers === 1 ? 'incorrect answer' : 'incorrect answers'}</p>
              </div>

              <div className="dark:bg-[#1F2937] bg-white p-6 rounded-lg shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium dark:text-gray-100">Current Streak</h3>
                  <LineChart className="h-4 w-4 text-purple-500" />
                </div>
                <p className="text-2xl font-bold dark:text-gray-100">{stats.streak} days</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{streakMessage}</p>
              </div>

              <div className="dark:bg-[#1F2937] bg-white p-6 rounded-lg shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium dark:text-gray-100">Flashcards Created</h3>
                  <PieChart className="h-4 w-4 text-orange-500" />
                </div>
                <p className="text-2xl font-bold dark:text-gray-100">{stats.flashcardsCreated}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Active learning cards</p>
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
              {/* Performance Chart */}
              <div className="dark:bg-[#1F2937] bg-white p-6 rounded-lg shadow-lg">
                <h3 className="text-lg font-medium mb-4 dark:text-gray-100">Weekly Performance</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsLineChart data={formattedWeeklyData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="name" stroke="#9CA3AF" />
                      <YAxis stroke="#9CA3AF" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1F2937',
                          border: 'none',
                          borderRadius: '0.5rem',
                          color: '#F3F4F6'
                        }}
                      />
                      <Line type="monotone" dataKey="questions" stroke="#3B82F6" name="Questions Attempted" />
                      <Line type="monotone" dataKey="correct" stroke="#10B981" name="Correct Answers" />
                    </RechartsLineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Category Distribution */}
              <div className="dark:bg-[#1F2937] bg-white p-6 rounded-lg shadow-lg">
                <h3 className="text-lg font-medium mb-4 dark:text-gray-100">Category Distribution</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={formattedCategoryData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label
                      >
                        {formattedCategoryData.map((_entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1F2937',
                          border: 'none',
                          borderRadius: '0.5rem',
                          color: '#F3F4F6'
                        }}
                      />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Difficulty Distribution */}
            <div className="dark:bg-[#1F2937] bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-lg font-medium mb-4 dark:text-gray-100">Difficulty Distribution</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsBarChart data={formattedDifficultyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="difficulty" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1F2937',
                        border: 'none',
                        borderRadius: '0.5rem',
                        color: '#F3F4F6'
                      }}
                    />
                    <Bar dataKey="count">
                      {formattedDifficultyData.map((_entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </RechartsBarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}