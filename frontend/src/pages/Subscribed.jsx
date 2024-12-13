import { useEffect, useState } from "react"
import { getSubscribedChannels } from "../utils/Subscription";

const Subscribed = () => {
  const [subscribedChannels, setSubscribedChannels] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(()=>{
    const fetchSubscribedChannels = async () => {
        try {
            const response = await getSubscribedChannels();
            console.log("Subscribed channels: ", response);
            setSubscribedChannels(response.data);
            setIsLoading(false);
        } catch (error) {
            console.error('Error fetching subscribed channels:', error);
            alert("Error fetching subscribed channels, please try again");
            setIsLoading(false);
        }
    }
    fetchSubscribedChannels();
  },[]);

  if (isLoading) {
    return (
      <div className="px-12 py-10">
        <h1 className="text-4xl font-bold">Loading subscriptions...</h1>
      </div>
    )
  }
  console.log(subscribedChannels);
  return (
    <div className="px-12 py-10">
      <h1 className="text-4xl font-bold">All Subscriptions</h1>
      {subscribedChannels.map((channel)=>(
        <div key={channel._id} className="flex items-center justify-between">
            <div className="flex items-center mt-10 gap-x-4 w-full">
              <div className="w-32 h-32 rounded-full overflow-hidden flex items-center justify-center">
                <img src={channel.channel.avatar} alt=""/>
              </div>
              <div>
                <h2>{channel.channel.fullName}</h2>
                <div className="flex items-center gap-x-3">
                    <h3>@{channel.channel.username}</h3>
                    <h3> . 1k subscribers</h3>
                </div>
                <p>{channel.channel.description}</p>
              </div>
            </div>
            <div className="bg-gray-700/70 px-3 py-2 rounded-full">
                <button>Subscribed</button>
            </div>
        </div>
      ))}
    </div>
  )
}

export default Subscribed
