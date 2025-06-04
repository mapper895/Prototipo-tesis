import { useEffect } from "react";
import { useFeedbackStore } from "../store/feedbackStore";
import { Loader } from "lucide-react";
import { Star } from "lucide-react";

const FeedbackScorecard = () => {
  const { getFeedbackData, loadingFeedback, feedbackData } = useFeedbackStore();

  useEffect(() => {
    getFeedbackData();
  }, [getFeedbackData]);

  if (loadingFeedback) {
    return (
      <div className="h-screen">
        <div className="flex justify-center items-center bg-white h-full">
          <Loader className="animate-spin text-[#001f60] size-10" />
        </div>
      </div>
    );
  }

  const { averageRating, totalRatings, totalFeedbacks } = feedbackData;

  return (
    <div className="grid place-items-center py-10 w-full bg-[#001f60] text-white">
      <p className="text-4xl mb-8">Feedback de los usuarios</p>
      <div className="w-[75vw] flex items-center gap-x-8">
        <div className="w-[30%] bg-blue-800 p-4 rounded-xl text-center">
          <h1 className="text-5xl text-white">{averageRating}</h1>
          <div className="star-outer relative text-3xl inline-block">
            <div
              className="star-inner absolute top-0 left-0 w-[50%] overflow-hidden"
              style={{ width: `${(averageRating / 5) * 100}%` }}
            ></div>
          </div>
          <p className="mt-3 tracking-[.1rem] text-white">
            Total de feedbacks: {totalFeedbacks}
          </p>
        </div>
        <div className="w-[70%]">
          {Object.entries(totalRatings).map(([rating, count]) => (
            <div
              key={rating}
              className="rating__progress-value h-8 flex items-center justify-evenly gap-x-2"
            >
              <p className="last:w-[10%] flex justify-center items-center gap-x-1">
                {rating}
                <Star size={15} fill="#ffd700" color="#ffd700" />
              </p>
              <div className="progress flex-1 h-2 rounded-lg bg-[#ff02]">
                <div
                  className="bar h-full bg-[#ffd700] rounded-lg"
                  style={{ width: `${(count / totalFeedbacks) * 100}%` }}
                ></div>
              </div>
              <p>{count}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeedbackScorecard;
