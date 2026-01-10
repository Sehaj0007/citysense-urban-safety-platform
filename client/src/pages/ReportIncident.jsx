import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { AlertTriangle, MapPin, Loader, Navigation } from 'lucide-react';

const ReportIncident = () => {
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [geoLoading, setGeoLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  const getLocation = () => {
    if (navigator.geolocation) {
      setGeoLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setValue('latitude', position.coords.latitude);
          setValue('longitude', position.coords.longitude);
          setGeoLoading(false);
        },
        (err) => {
          console.error(err);
          setGeoLoading(false);
          alert('Could not get location. Please enter coordinates manually.');
        }
      );
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    setServerError('');
    try {
      await api.post('/incidents', {
        ...data,
        latitude: parseFloat(data.latitude),
        longitude: parseFloat(data.longitude),
      });
      navigate('/map');
    } catch (err) {
      setServerError(err.response?.data?.message || 'Failed to submit report');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-lg">
        <div className="flex items-center justify-center mb-8">
          <AlertTriangle className="w-10 h-10 text-red-600 mr-3" />
          <h2 className="text-3xl font-extrabold text-gray-900">Report an Incident</h2>
        </div>

        {serverError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Incident Type</label>
            <select
              {...register('type', { required: 'Please select an incident type' })}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
            >
              <option value="">Select Type</option>
              <option value="harassment">Harassment</option>
              <option value="theft">Theft</option>
              <option value="unsafe_lighting">Unsafe Lighting</option>
              <option value="stalking">Stalking</option>
              <option value="assault">Assault</option>
              <option value="suspicious_activity">Suspicious Activity</option>
              <option value="other">Other</option>
            </select>
            {errors.type && <p className="text-red-500 text-xs mt-1">{errors.type.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              {...register('description', { required: 'Please provide a description' })}
              rows={4}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
              placeholder="Describe what happened..."
            />
            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
            <div className="grid grid-cols-2 gap-4 mb-2">
              <div>
                <input
                  type="number"
                  step="any"
                  {...register('latitude', { required: 'Latitude is required' })}
                  placeholder="Latitude"
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                />
              </div>
              <div>
                <input
                  type="number"
                  step="any"
                  {...register('longitude', { required: 'Longitude is required' })}
                  placeholder="Longitude"
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                />
              </div>
            </div>
            {errors.latitude && <p className="text-red-500 text-xs mt-1">{errors.latitude.message}</p>}
            
            <button
              type="button"
              onClick={getLocation}
              disabled={geoLoading}
              className="flex items-center text-sm text-blue-600 hover:text-blue-500 mt-2"
            >
              {geoLoading ? <Loader className="w-4 h-4 mr-1 animate-spin" /> : <Navigation className="w-4 h-4 mr-1" />}
              Use My Current Location
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Address (Optional)</label>
            <input
              type="text"
              {...register('address')}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
              placeholder="123 Main St..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Image URL (Optional)</label>
            <input
              type="text"
              {...register('imageUrl')}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div className="flex items-center">
            <input
              id="isAnonymous"
              type="checkbox"
              {...register('isAnonymous')}
              className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
            />
            <label htmlFor="isAnonymous" className="ml-2 block text-sm text-gray-900">
              Submit Anonymously
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
          >
            {loading ? 'Submitting...' : 'Submit Report'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReportIncident;
