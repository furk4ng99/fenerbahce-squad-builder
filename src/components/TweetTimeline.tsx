import { Twitter } from 'lucide-react';

const TWEETS = [
    {
        id: 1,
        user: "Fenerbahçe SK",
        handle: "@Fenerbahce",
        content: "💛💙 The new season is here! Build your dream squad now! #Fenerbahce",
        time: "2h",
        likes: "12.5K",
        retweets: "3.2K"
    },
    {
        id: 2,
        user: "Jose Mourinho",
        handle: "@josemourinhotv",
        content: "We are ready. The squad is looking strong. Let's go! ⚽️",
        time: "4h",
        likes: "45K",
        retweets: "8.9K"
    },
    {
        id: 3,
        user: "12 Numara",
        handle: "@12numaraorg",
        content: "Who should be our starting striker? Dzeko or En-Nesyri? 🤔",
        time: "5h",
        likes: "2.1K",
        retweets: "500"
    }
];

export const TweetTimeline = () => {
    return (
        <div className="bg-white/60 backdrop-blur-md rounded-xl shadow-lg p-6 border border-white/20">
            <div className="flex items-center gap-2 mb-4 pb-4 border-b border-gray-200/50">
                <Twitter className="text-[#1DA1F2]" />
                <h3 className="font-bold text-lg text-gray-900">Latest Updates</h3>
            </div>
            <div className="space-y-6">
                {TWEETS.map((tweet) => (
                    <div key={tweet.id} className="flex gap-3">
                        <div className="w-10 h-10 rounded-full bg-fb-navy flex items-center justify-center text-fb-yellow font-bold text-sm">
                            {tweet.user[0]}
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-2">
                                <span className="font-bold text-gray-900">{tweet.user}</span>
                                <span className="text-gray-500 text-sm">{tweet.handle}</span>
                                <span className="text-gray-400 text-sm">· {tweet.time}</span>
                            </div>
                            <p className="text-gray-800 mt-1 text-sm">{tweet.content}</p>
                            <div className="flex gap-4 mt-2 text-gray-500 text-xs">
                                <span>💬 {Math.floor(Math.random() * 100)}</span>
                                <span>🔁 {tweet.retweets}</span>
                                <span>❤️ {tweet.likes}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
