import { GoogleGenerativeAI } from '@google/generative-ai';

export class AIService {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn('GEMINI_API_KEY not set - AI features will not work');
    }
    this.genAI = new GoogleGenerativeAI(apiKey || 'dummy-key');
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  }

  async generateDemandForecast(data: {
    propertyName: string;
    historicalBookings: number[];
    seasonalEvents: string[];
    month: string;
  }): Promise<any> {
    const prompt = `You are a hotel demand forecasting expert. Analyze the following data and provide a demand forecast:
    
Hotel: ${data.propertyName}
Historical monthly bookings: ${data.historicalBookings.join(', ')}
Upcoming events: ${data.seasonalEvents.join(', ')}
Forecasting for: ${data.month}

Provide a JSON response with:
{
  "predictedBookings": <number>,
  "confidence": <percentage>,
  "trend": "increasing|decreasing|stable",
  "reasoning": "<brief explanation>",
  "recommendations": ["<recommendation 1>", "<recommendation 2>"]
}`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Extract JSON from markdown code blocks if present
      const jsonMatch = text.match(/```json\n?([\s\S]*?)\n?```/) || text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[1] || jsonMatch[0]);
      }
      
      return { raw: text };
    } catch (error) {
      console.error('AI Forecast Error:', error);
      throw new Error('Failed to generate demand forecast');
    }
  }

  async generateDynamicPricing(data: {
    propertyName: string;
    basePrice: number;
    occupancyRate: number;
    seasonalFactor: number;
    competitorPrices: number[];
  }): Promise<any> {
    const prompt = `You are a hotel revenue management expert. Suggest dynamic pricing:

Hotel: ${data.propertyName}
Base price: ₹${data.basePrice}
Current occupancy: ${data.occupancyRate}%
Seasonal factor: ${data.seasonalFactor}x
Competitor prices: ₹${data.competitorPrices.join(', ₹')}

Provide JSON response:
{
  "suggestedPrice": <number>,
  "priceChange": <percentage>,
  "reasoning": "<explanation>",
  "strategy": "premium|competitive|discount",
  "validUntil": "<time period>"
}`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      const jsonMatch = text.match(/```json\n?([\s\S]*?)\n?```/) || text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[1] || jsonMatch[0]);
      }
      
      return { raw: text };
    } catch (error) {
      console.error('AI Pricing Error:', error);
      throw new Error('Failed to generate pricing suggestion');
    }
  }

  async generatePersonalizedRecommendations(data: {
    guestPreferences: string[];
    bookingHistory: string[];
    membershipTier: string;
  }): Promise<any> {
    const prompt = `Generate personalized hotel recommendations for a guest:

Guest preferences: ${data.guestPreferences.join(', ')}
Past stays: ${data.bookingHistory.join(', ')}
Membership: ${data.membershipTier}

Provide JSON response:
{
  "roomRecommendations": ["<room type 1>", "<room type 2>"],
  "amenityRecommendations": ["<amenity 1>", "<amenity 2>"],
  "serviceRecommendations": ["<service 1>", "<service 2>"],
  "specialOffers": ["<offer 1>"],
  "reasoning": "<why these recommendations>"
}`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      const jsonMatch = text.match(/```json\n?([\s\S]*?)\n?```/) || text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[1] || jsonMatch[0]);
      }
      
      return { raw: text };
    } catch (error) {
      console.error('AI Recommendations Error:', error);
      throw new Error('Failed to generate recommendations');
    }
  }

  async analyzeFeedbackSentiment(feedbacks: Array<{ rating: number; comment: string }>): Promise<any> {
    const feedbackText = feedbacks
      .map((f, i) => `${i + 1}. Rating: ${f.rating}/5 - "${f.comment}"`)
      .join('\n');

    const prompt = `Analyze these hotel guest feedbacks and provide sentiment analysis:

${feedbackText}

Provide JSON response:
{
  "overallSentiment": "positive|neutral|negative",
  "sentimentScore": <0-100>,
  "commonThemes": ["<theme 1>", "<theme 2>"],
  "strengths": ["<strength 1>", "<strength 2>"],
  "weaknesses": ["<weakness 1>", "<weakness 2>"],
  "actionableInsights": ["<insight 1>", "<insight 2>"],
  "summary": "<brief overall summary>"
}`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      const jsonMatch = text.match(/```json\n?([\s\S]*?)\n?```/) || text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[1] || jsonMatch[0]);
      }
      
      return { raw: text };
    } catch (error) {
      console.error('AI Sentiment Analysis Error:', error);
      throw new Error('Failed to analyze feedback sentiment');
    }
  }

  async generateAttractions(location: string, preferences?: string[]): Promise<any> {
    const prefText = preferences && preferences.length > 0 
      ? `Guest preferences: ${preferences.join(', ')}`
      : 'General tourist';

    const prompt = `Generate top tourist attractions and itinerary for ${location}.
${prefText}

Provide JSON response:
{
  "attractions": [
    {
      "name": "<attraction name>",
      "description": "<brief description>",
      "category": "<museum|park|restaurant|shopping|cultural>",
      "estimatedDuration": "<hours>",
      "recommendedTime": "<morning|afternoon|evening>"
    }
  ],
  "suggestedItinerary": "<day plan>",
  "travelTips": ["<tip 1>", "<tip 2>"]
}`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      const jsonMatch = text.match(/```json\n?([\s\S]*?)\n?```/) || text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[1] || jsonMatch[0]);
      }
      
      return { raw: text };
    } catch (error) {
      console.error('AI Attractions Error:', error);
      throw new Error('Failed to generate attractions');
    }
  }
}

export const aiService = new AIService();
