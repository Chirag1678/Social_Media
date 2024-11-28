import { formatDistanceToNow } from 'date-fns';
import { BiDislike, BiLike } from 'react-icons/bi';
const TweetCard = ({tweet}) => {
    // console.log(tweet);
  return (
    <div className="w-full rounded-xl border-[0.01rem] p-5 my-6 flex items-start gap-3 ">
    <div className="w-12 h-12 rounded-full overflow-hidden flex items-center justify-center">
        <img src={tweet.owner.avatar} alt={tweet.owner.fullName} />
      </div>
      <div>
        <div className="flex items-center gap-3">
            <p>{tweet.owner.fullName}</p>
            <p>{tweet.createdAt ? formatDistanceToNow(new Date(tweet.createdAt), { addSuffix: true }) : 'Unknown'}</p>
        </div>
        <div>
            {tweet.content}
        </div>
        {tweet.image && <img src={tweet.image} alt={tweet.content} className="w-full rounded-xl mt-3"/>}
        <div className='flex items-center gap-3'>
            <button className='flex items-center gap-2'><BiLike className='text-xl'/> 0</button>
            <button><BiDislike className='text-xl' /></button>
        </div>
      </div>
    </div>
  )
}

export default TweetCard
