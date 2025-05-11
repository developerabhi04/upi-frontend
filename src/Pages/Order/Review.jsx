import { useState, useEffect } from "react";
import { Rating } from "@mui/material";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { fetchReviews, submitReview } from "../../redux/slices/reviewSlices.js";


const ReviewSection = ({ productId, reviewed }) => {
    const dispatch = useDispatch();

    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");

    // On mount or when productId changes, fetch reviews and log the result for debugging
    useEffect(() => {
        if (productId) {
            dispatch(fetchReviews(productId))
                .unwrap()
                .then((data) => {
                    console.log("Fetched reviews data:", data);
                })
                .catch((err) => {
                    console.error("Error in fetchReviews:", err);
                });
        }
    }, [dispatch, productId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (rating === 0 || comment.trim() === "") {
            toast.error("Please provide both a rating and a comment.");
            return;
        }
        try {
            console.log("Submitting review:", { productId, rating, comment });
            await dispatch(submitReview({ productId, rating, comment })).unwrap();
            toast.success("Review submitted successfully!");
            setRating(0);
            setComment("");
            // Re-fetch reviews after submission to ensure the list is updated
            dispatch(fetchReviews(productId));
        } catch (err) {
            console.error("Submit review error:", err);
            toast.error(err);
        }
    };

    return (
        <div className="review-section">
            <h2>Leave Your Review</h2>
            {reviewed ? (
                <p>You have already submitted a review for this product.</p>
            ) : (
                <form className="review-form" onSubmit={handleSubmit}>
                    <div className="rating-input">
                        <Rating
                            value={rating}
                            onChange={(e, newValue) => {
                                console.log("Rating changed:", newValue);
                                setRating(newValue);
                            }}
                        />
                    </div>
                    <textarea
                        placeholder="Write your review here..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                    />
                    <button type="submit">Submit Review</button>
                </form>
            )}
           
        </div>
    );
};

export default ReviewSection;
