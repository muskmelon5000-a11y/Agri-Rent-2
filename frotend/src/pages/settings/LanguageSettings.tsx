import React, { useState } from 'react';
import { AppHeader } from '../../components/shared/AppHeader';
import { CheckIcon } from 'lucide-react';
const languages = [
{
  code: 'en',
  name: 'English',
  native: 'English'
},
{
  code: 'hi',
  name: 'Hindi',
  native: 'हिन्दी'
},
{
  code: 'ta',
  name: 'Tamil',
  native: 'தமிழ்'
},
{
  code: 'te',
  name: 'Telugu',
  native: 'తెలుగు'
},
{
  code: 'mr',
  name: 'Marathi',
  native: 'मराठी'
},
{
  code: 'pa',
  name: 'Punjabi',
  native: 'ਪੰਜਾਬੀ'
}];

export function LanguageSettings() {
  const [selected, setSelected] = useState('en');
  return (
    <div className="h-full bg-background flex flex-col">
      <AppHeader title="App Language" showBack />

      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-3">
        <div className="bg-primary-50 border border-primary-200 rounded-xl p-4 mb-6">
          <p className="text-sm text-primary-800 font-medium">
            Changes will apply immediately across the entire app.
          </p>
        </div>

        {languages.map((lang) =>
        <button
          key={lang.code}
          onClick={() => setSelected(lang.code)}
          className={`w-full p-5 rounded-2xl border-2 transition-all text-left ${selected === lang.code ? 'border-primary bg-primary-50' : 'border-gray-200 bg-surface hover:border-gray-300'}`}>
          
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xl font-bold text-gray-900 mb-1">
                  {lang.native}
                </div>
                <div className="text-sm text-gray-600">{lang.name}</div>
              </div>
              {selected === lang.code &&
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <CheckIcon className="w-5 h-5 text-white" />
                </div>
            }
            </div>
          </button>
        )}
      </div>
    </div>);

}