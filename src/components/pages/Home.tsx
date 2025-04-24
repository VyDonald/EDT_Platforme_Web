import React from 'react';
import StatCard from '../shared/StatCard';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { MapPin, CloudSun, Thermometer, Wind, Droplets } from 'lucide-react';
const chartData = [{
  name: '2020',
  value1: 55,
  value2: 60
}, {
  name: '2021',
  value1: 65,
  value2: 58
}, {
  name: '2022',
  value1: 75,
  value2: 85
}, {
  name: '2023',
  value1: 80,
  value2: 70
}];
const lineData = [{
  name: '2020',
  value1: 20,
  value2: 60
}, {
  name: '2021',
  value1: 40,
  value2: 30
}, {
  name: '2022',
  value1: 30,
  value2: 70
}, {
  name: '2023',
  value1: 70,
  value2: 80
}];
const pieData = [{
  name: 'Niveau 1',
  value: 50,
  color: '#004d40'
}, {
  name: 'Niveau 2',
  value: 30,
  color: '#00bfa5'
}, {
  name: 'Niveau 3',
  value: 20,
  color: '#1de9b6'
}];
const Home = () => {
  return <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <StatCard title="MÉTÉO" subtitle="Somgandé, Burkina Faso">
          <div className="mt-4 flex items-center justify-between p-2">
            <div className="flex items-center">
              <CloudSun size={48} className="text-yellow-500 mr-4" />
              <div>
                <div className="text-3xl font-bold">32°C</div>
                <div className="text-gray-500">Ensoleillé</div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center text-gray-600">
                <Thermometer size={18} className="mr-2" />
                <span>Ressenti: 34°C</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Wind size={18} className="mr-2" />
                <span>Vent: 12 km/h</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Droplets size={18} className="mr-2" />
                <span>Humidité: 45%</span>
              </div>
            </div>
          </div>
        </StatCard>
        <StatCard title="LOCALISATION" subtitle="IBAM">
          <div className="mt-4">
            <div className="bg-gray-100 p-4 rounded-lg">
              <div className="flex items-center mb-3">
                <MapPin size={24} className="text-emerald-500 mr-2" />
                <div>
                  <div className="font-medium">
                    Institut Burkinabè des Arts et Métiers (IBAM)
                  </div>
                  <div className="text-sm text-gray-600">
                    03 BP 7021, Ouagadougou 03
                  </div>
                </div>
              </div>
              <div className="text-sm text-gray-600 space-y-1">
                <div>Tél.: 25-35-67-31/62</div>
                <div>Localisation: Somgandé</div>
                <div>Ville: Ouagadougou</div>
                <div>Pays: Burkina Faso</div>
              </div>
            </div>
          </div>
        </StatCard>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard title="ENSEIGNANTS" subtitle="Total des enseignants" value="24" />
        <StatCard title="TAUX D'OCCUPATION" subtitle="Salles de cours" value="45%">
          <div className="mt-2 flex items-center">
            <div className="w-16 h-16">
              <PieChart width={64} height={64}>
                <Pie data={[{
                value: 45
              }, {
                value: 55
              }]} cx="50%" cy="50%" innerRadius={20} outerRadius={32} dataKey="value" startAngle={90} endAngle={-270}>
                  <Cell fill="#00bfa5" />
                  <Cell fill="#e0f2f1" />
                </Pie>
              </PieChart>
            </div>
            <span className="text-4xl ml-4">45%</span>
          </div>
        </StatCard>
        <StatCard title="HEURES PLANIFIÉES" subtitle="Ce semestre" value="2,453h" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <StatCard title="RÉPARTITION DES COURS">
            <div className="h-64 mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value1" fill="#00bfa5" />
                  <Bar dataKey="value2" fill="#004d40" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </StatCard>
        </div>
        <div>
          <StatCard title="DISTRIBUTION">
            <div className="h-64 flex items-center justify-center">
              <div className="w-40 h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" labelLine={false} outerRadius={80} fill="#8884d8" dataKey="value">
                      {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="mt-2">
              {pieData.map((item, index) => <div key={index} className="flex items-center mt-1">
                  <div className="w-3 h-3 mr-2" style={{
                backgroundColor: item.color
              }}></div>
                  <span className="text-xs">
                    {item.name}: {item.value}%
                  </span>
                </div>)}
            </div>
          </StatCard>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <StatCard title="RÉPARTITION GÉOGRAPHIQUE">
          <div className="h-64 mt-4 relative">
            <img src="/378863-PCAW2O-408.jpg" alt="Carte du monde" className="w-full h-full object-contain opacity-50" />
            <div className="absolute top-1/4 left-1/4 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center text-white">
              1
            </div>
            <div className="absolute top-2/3 left-1/3 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center text-white">
              3
            </div>
            <div className="absolute top-1/2 right-1/4 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center text-white">
              2
            </div>
          </div>
        </StatCard>
        <StatCard title="ÉVOLUTION DES COURS">
          <div className="h-64 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="value1" stroke="#00bfa5" strokeWidth={2} />
                <Line type="monotone" dataKey="value2" stroke="#004d40" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </StatCard>
      </div>
    </div>;
};
export default Home;