import { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { CATEGORIES } from '../../lib/constants';
import { generateDealDescription } from '../../lib/claude';
import { useAuth } from '../../hooks/useAuth';
import Button from '../ui/Button';

const EXPIRES_OPTIONS = [
  { value: 1, label: '1 hour' },
  { value: 2, label: '2 hours' },
  { value: 4, label: '4 hours' },
  { value: 8, label: '8 hours' },
  { value: 24, label: '24 hours' },
];

export default function DealForm({ onSubmit, loading }) {
  const { user } = useAuth();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [category, setCategory] = useState('food');
  const [originalPrice, setOriginalPrice] = useState('');
  const [dealPrice, setDealPrice] = useState('');
  const [quantityTotal, setQuantityTotal] = useState('');
  const [expiresIn, setExpiresIn] = useState(2);
  const [validationError, setValidationError] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);

  const categoryOptions = CATEGORIES.filter((c) => c.value !== 'all');

  const handleGenerateDescription = async () => {
    if (!title) {
      setValidationError('Enter a title first to generate a description.');
      return;
    }

    setAiLoading(true);
    setValidationError(null);

    try {
      const generated = await generateDealDescription({
        title,
        originalPrice,
        dealPrice,
        category,
        restaurantName: user?.business_name || '',
      });
      setDescription(generated);
    } catch (err) {
      setValidationError(err.message || 'Failed to generate description.');
    } finally {
      setAiLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setValidationError(null);

    // Validation
    if (parseFloat(dealPrice) >= parseFloat(originalPrice)) {
      setValidationError('Deal price must be less than the original price.');
      return;
    }

    if (parseInt(quantityTotal, 10) <= 0) {
      setValidationError('Quantity must be greater than 0.');
      return;
    }

    onSubmit({
      title,
      description,
      photo_url: photoUrl,
      category,
      original_price: originalPrice,
      deal_price: dealPrice,
      quantity_total: quantityTotal,
      expires_in: expiresIn,
    });
  };

  const inputClass =
    'w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-scarlet focus:outline-none focus:ring-1 focus:ring-scarlet';

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {validationError && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
          {validationError}
        </div>
      )}

      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Title
        </label>
        <input
          type="text"
          required
          placeholder="e.g. Half-off pepperoni pizza"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={inputClass}
        />
      </div>

      {/* Description + AI button */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <button
            type="button"
            onClick={handleGenerateDescription}
            disabled={aiLoading}
            className="inline-flex items-center gap-1 text-xs font-medium text-scarlet hover:underline disabled:opacity-50"
          >
            <Sparkles className="h-3.5 w-3.5" />
            {aiLoading ? 'Generating...' : 'Generate with AI'}
          </button>
        </div>
        <textarea
          rows={3}
          placeholder="Describe your deal..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={inputClass}
        />
      </div>

      {/* Photo URL */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Photo URL
        </label>
        <input
          type="url"
          placeholder="https://example.com/photo.jpg"
          value={photoUrl}
          onChange={(e) => setPhotoUrl(e.target.value)}
          className={inputClass}
        />
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Category
        </label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className={inputClass}
        >
          {categoryOptions.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
      </div>

      {/* Prices */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Original Price ($)
          </label>
          <input
            type="number"
            step="0.01"
            min="0.01"
            required
            placeholder="12.99"
            value={originalPrice}
            onChange={(e) => setOriginalPrice(e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Deal Price ($)
          </label>
          <input
            type="number"
            step="0.01"
            min="0.01"
            required
            placeholder="6.49"
            value={dealPrice}
            onChange={(e) => setDealPrice(e.target.value)}
            className={inputClass}
          />
        </div>
      </div>

      {/* Quantity */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Quantity Available
        </label>
        <input
          type="number"
          min="1"
          required
          placeholder="10"
          value={quantityTotal}
          onChange={(e) => setQuantityTotal(e.target.value)}
          className={inputClass}
        />
      </div>

      {/* Expires in */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Expires In
        </label>
        <select
          value={expiresIn}
          onChange={(e) => setExpiresIn(Number(e.target.value))}
          className={inputClass}
        >
          {EXPIRES_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Submit */}
      <Button type="submit" disabled={loading} className="w-full py-2.5">
        {loading ? 'Posting...' : 'Post Deal'}
      </Button>
    </form>
  );
}
