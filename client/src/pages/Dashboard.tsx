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
import axios from "axios";
import { MCQs } from "../types/mcq";

export default function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [questionsCount, setQuestionsCount] = useState<number>();

  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    axios.get(`http://localhost:3000/api/quiz/mcq`,
      {
        headers: {
            Authorization: `Bearer ${token}`
        }
      }
    ).then((response) => { 
        console.log(response.data.mcq)
        const count = response.data.mcq.reduce((acc: number, mcq: MCQs) => mcq.mcqs.length + acc, 0);
        setQuestionsCount(count);
    })
      .catch((error) => { console.error(error); });
  }, []);

  useEffect(() => {
    axios.get(`http://localhost:3000/api/attempt/user`)
      .then((response) => {
        console.log(response.data)
    }).catch((error) => { console.error(error); });
  }, []);
 
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Sample data
  const stats = {
    totalQuestions: questionsCount,
    questionsAnswered: 876,
    correctAnswers: 654,
    flashcardsCreated: 320,
    averageScore: 75,
    streak: 12
  };

  const weeklyData = [
    { name: 'Mon', questions: 45, correct: 32 },
    { name: 'Tue', questions: 38, correct: 28 },
    { name: 'Wed', questions: 52, correct: 41 },
    { name: 'Thu', questions: 35, correct: 25 },
    { name: 'Fri', questions: 43, correct: 38 },
    { name: 'Sat', questions: 28, correct: 20 },
    { name: 'Sun', questions: 48, correct: 42 }
  ];

  const categoryData = [
    { name: 'Science', value: 35 },
    { name: 'Math', value: 25 },
    { name: 'History', value: 20 },
    { name: 'Language', value: 20 }
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  const difficultyData = [
    { difficulty: 'Easy', count: 45 },
    { difficulty: 'Medium', count: 35 },
    { difficulty: 'Hard', count: 20 }
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
                <p className="text-xs text-gray-500 dark:text-gray-400">{stats.questionsAnswered} answered</p>
              </div>

              <div className="dark:bg-[#1F2937] bg-white p-6 rounded-lg shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium dark:text-gray-100">Average Score</h3>
                  <TrendingUp className="h-4 w-4 text-green-500" />
                </div>
                <p className="text-2xl font-bold dark:text-gray-100">{stats.averageScore}%</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{stats.correctAnswers} correct answers</p>
              </div>

              <div className="dark:bg-[#1F2937] bg-white p-6 rounded-lg shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium dark:text-gray-100">Current Streak</h3>
                  <LineChart className="h-4 w-4 text-purple-500" />
                </div>
                <p className="text-2xl font-bold dark:text-gray-100">{stats.streak} days</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Keep it up!</p>
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
                    <RechartsLineChart data={weeklyData}>
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
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label
                      >
                        {categoryData.map((entry, index) => (
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
                  <RechartsBarChart data={difficultyData}>
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
                      {difficultyData.map((_entry, index) => (
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