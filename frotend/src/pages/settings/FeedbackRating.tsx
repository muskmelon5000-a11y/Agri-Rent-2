import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppHeader } from '../../components/shared/AppHeader';
import { Button } from '../../components/shared/Button';
import { Card } from '../../components/shared/Card';
import { StarIcon, UploadIcon } from 'lucide-react';
const tags = [
'Easy to use',
'Good prices',
'Fast booking',
'Helpful support',
'App is slow',
'Hard to find equipment',
'Payment issues'];

export function FeedbackRating() {
  const navigate = useNavigate();
  const [rating, setRating] = useState(0);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };
  return (
    <div className="h-full bg-background flex flex-col">
      <AppHeader title="App Feedback" showBack />

      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
        <div className="text-center mb-2">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            How is your experience?
          </h1>
          <p className="text-gray-600">
            Your feedback helps us improve CropMate for everyone.
          </p>
        </div>

        {/* Star Rating */}
        <Card className="p-6 flex justify-center gap-2">
          {[1, 2, 3, 4, 5].map((star) =>
          <button
            key={star}
            onClick={() => setRating(star)}
            className="p-1 transition-transform hover:scale-110 active:scale-95">
            
              <StarIcon
              className={`w-10 h-10 ${star <= rating ? 'text-secondary-700 fill-secondary-700' : 'text-gray-300'}`} />
            
            </button>
          )}
        </Card>

        {/* Tags */}
        {rating > 0 &&
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
            <h2 className="text-sm font-bold text-gray-900 mb-3">
              What went well or needs improvement?
            </h2>
            <div className="flex flex-wrap gap-2 mb-6">
              {tags.map((tag) =>
            <button
              key={tag}
              onClick={() => toggleTag(tag)}
              className={`px-4 py-2 rounded-full text-sm font-semibold border-2 transition-colors ${selectedTags.includes(tag) ? 'border-primary bg-primary-50 text-primary' : 'border-gray-200 bg-surface text-gray-600 hover:border-gray-300'}`}>
              
                  {tag}
                </button>
            )}
            </div>

            {/* Textarea */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Tell us more (Optional)
              </label>
              <textarea
              className="w-full p-4 border-2 border-gray-200 rounded-2xl focus:border-primary focus:outline-none resize-none h-32"
              placeholder="Share your thoughts or suggestions..." />
            
            </div>

            {/* Screenshot Upload */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Attach Screenshot (Optional)
              </label>
              <button className="w-full h-24 border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center text-gray-500 hover:bg-gray-50 hover:border-primary transition-colors">
                <UploadIcon className="w-6 h-6 mb-2" />
                <span className="text-sm font-medium">Tap to upload image</span>
              </button>
            </div>
          </div>
        }
      </div>

      <div className="p-6 bg-surface border-t border-gray-200">
        <Button
          fullWidth
          size="lg"
          disabled={rating === 0}
          onClick={() => navigate('/profile')}>
          
          Submit Feedback
        </Button>
      </div>
    </div>);

}