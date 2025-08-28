'use client';

import React, { useState } from 'react';
import { ThumbsUp, ThumbsDown } from 'lucide-react';

interface RecipeFeedbackProps {
  recipeId: string;
  initialFeedback?: string | null;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  onFeedbackChange?: (feedback: string | null) => void;
}

const RecipeFeedback: React.FC<RecipeFeedbackProps> = ({
  recipeId,
  initialFeedback = null,
  size = 'md',
  showLabel = true,
  onFeedbackChange
}) => {
  const [feedback, setFeedback] = useState<string | null>(initialFeedback);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6'
  };

  const buttonSizes = {
    sm: 'p-1',
    md: 'p-2',
    lg: 'p-3'
  };

  const handleFeedback = async (newFeedback: string) => {
    // Allow toggling - if clicking the same feedback, clear it
    const feedbackToSend = feedback === newFeedback ? null : newFeedback;
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch(`/api/recipes/${recipeId}/feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ feedback: feedbackToSend }),
      });

      if (response.ok) {
        setFeedback(feedbackToSend);
        onFeedbackChange?.(feedbackToSend);
      } else {
        console.error('Failed to submit feedback');
        // Could show a toast notification here
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
      // Could show a toast notification here
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center space-x-3">
      {showLabel && (
        <span className="text-sm font-medium text-gray-700">
          How was this recipe?
        </span>
      )}
      <div className="flex items-center space-x-1">
        <button
          onClick={() => handleFeedback('thumbs_up')}
          disabled={isSubmitting}
          className={`${buttonSizes[size]} rounded-lg border transition-all duration-200 ${
            feedback === 'thumbs_up'
              ? 'bg-green-100 border-green-300 text-green-700 shadow-sm'
              : 'bg-white border-gray-300 text-gray-600 hover:border-green-300 hover:text-green-600 hover:bg-green-50'
          } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          title="I liked this recipe"
        >
          <ThumbsUp className={`${sizeClasses[size]} ${
            feedback === 'thumbs_up' ? 'fill-current' : ''
          }`} />
        </button>
        
        <button
          onClick={() => handleFeedback('thumbs_down')}
          disabled={isSubmitting}
          className={`${buttonSizes[size]} rounded-lg border transition-all duration-200 ${
            feedback === 'thumbs_down'
              ? 'bg-red-100 border-red-300 text-red-700 shadow-sm'
              : 'bg-white border-gray-300 text-gray-600 hover:border-red-300 hover:text-red-600 hover:bg-red-50'
          } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          title="I didn't like this recipe"
        >
          <ThumbsDown className={`${sizeClasses[size]} ${
            feedback === 'thumbs_down' ? 'fill-current' : ''
          }`} />
        </button>
      </div>
      
      {feedback && (
        <span className="text-xs text-gray-500">
          {feedback === 'thumbs_up' ? 'Thanks for the feedback!' : 'Thanks, we\'ll learn from this!'}
        </span>
      )}
    </div>
  );
};

export default RecipeFeedback;