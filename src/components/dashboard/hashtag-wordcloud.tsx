import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { HashtagData } from '@/types/dashboard';

interface HashtagWordCloudProps {
  data: HashtagData[];
}

export function HashtagWordCloud({ data }: HashtagWordCloudProps) {
  // Normalize values to create different font sizes
  const maxValue = Math.max(...data.map(d => d.value));
  const minValue = Math.min(...data.map(d => d.value));
  
  const getFontSize = (value: number) => {
    const normalized = (value - minValue) / (maxValue - minValue);
    return 14 + normalized * 32; // Font size between 14px and 46px
  };

  const getColor = (value: number) => {
    const normalized = (value - minValue) / (maxValue - minValue);
    const colors = [
      'text-blue-400',
      'text-purple-500',
      'text-pink-500',
      'text-red-500',
      'text-orange-500',
      'text-yellow-500',
      'text-green-500',
      'text-teal-500',
      'text-cyan-500',
      'text-indigo-500'
    ];
    return colors[Math.floor(normalized * (colors.length - 1))];
  };

  const getRandomRotation = () => {
    const rotations = [0, 15, -15, 30, -30];
    return rotations[Math.floor(Math.random() * rotations.length)];
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900">
          Hashtag Co-occurrence
        </CardTitle>
        <p className="text-sm text-gray-500">
          Most frequently co-occurring hashtags in trending music content
        </p>
      </CardHeader>
      <CardContent>
        <div className="h-80 flex flex-wrap items-center justify-center gap-2 p-4 overflow-hidden">
          {data.map((hashtag) => (
            <span
              key={hashtag.text}
              className={`
                font-bold transition-all duration-200 hover:scale-110 cursor-pointer
                ${getColor(hashtag.value)}
              `}
              style={{
                fontSize: `${getFontSize(hashtag.value)}px`,
                transform: `rotate(${getRandomRotation()}deg)`,
                lineHeight: '1.2',
                margin: '2px 4px'
              }}
              title={`#${hashtag.text} - ${hashtag.value} occurrences`}
            >
              #{hashtag.text}
            </span>
          ))}
        </div>
      </CardContent>
    </Card>
  );
} 