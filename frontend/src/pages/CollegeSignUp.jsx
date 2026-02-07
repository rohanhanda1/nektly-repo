import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, Check, DollarSign, Calendar, Users, Loader2, X } from 'lucide-react';
import Footer from '../components/landing/Footer';

const INTERESTS = [
  "STEM", "Business", "Arts", "Humanities", "Pre-Med", "Engineering", 
  "Computer Science", "Social Sciences", "Music", "Sports", "Research",
  "Entrepreneurship", "Writing", "Film/Media", "Politics", "Law"
];

const YEARS = ["Freshman", "Sophomore", "Junior", "Senior"];

export default function CollegeSignUp() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    university: '',
    major: '',
    year: '',
    interests: [],
    experience: '',
    availability: '',
    calendly_link: '',
    bio: ''
  });

  const updateForm = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleInterest = (interest) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
        const res = await fetch("https://clw4mxgv55.execute-api.us-east-1.amazonaws.com/prod/college-signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
          });
      
          if (!res.ok) throw new Error("Failed");
      setIsComplete(true);
    } catch (error) {
      console.error('Error:', error);
    }
    setIsSubmitting(false);
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return formData.name && formData.email && formData.university && formData.major && formData.year;
      case 2:
        return formData.interests.length > 0;
      default:
        return true;
    }
  };

  if (isComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-violet-50 pt-24">
        <div className="max-w-2xl mx-auto px-6 py-16">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center"
          >
            <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
              <Check className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Application Received! 🎉</h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Thank you for applying to be a Nektly mentor. We'll review your application and get back to you soon.
            </p>
            <div className="bg-amber-50 rounded-2xl p-6 border border-amber-100">
              <DollarSign className="w-8 h-8 text-amber-500 mx-auto mb-3" />
              <p className="text-gray-700">
                <strong>What happens next?</strong><br />
                We'll verify your enrollment and send you an email at {formData.email} with next steps to start mentoring.
              </p>
            </div>
          </motion.div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-violet-50 pt-24">
      <div className="max-w-2xl mx-auto px-6 py-12">
        {/* Benefits Banner */}
        {step === 1 && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-3 gap-4 mb-8"
          >
            <div className="bg-white rounded-2xl p-4 text-center shadow-sm border border-gray-100">
              <DollarSign className="w-6 h-6 text-green-500 mx-auto mb-2" />
              <div className="font-bold text-gray-900">$40/call</div>
              <div className="text-xs text-gray-500">Per session</div>
            </div>
            <div className="bg-white rounded-2xl p-4 text-center shadow-sm border border-gray-100">
              <Calendar className="w-6 h-6 text-violet-500 mx-auto mb-2" />
              <div className="font-bold text-gray-900">Flexible</div>
              <div className="text-xs text-gray-500">Your schedule</div>
            </div>
            <div className="bg-white rounded-2xl p-4 text-center shadow-sm border border-gray-100">
              <Users className="w-6 h-6 text-amber-500 mx-auto mb-2" />
              <div className="font-bold text-gray-900">Impact</div>
              <div className="text-xs text-gray-500">Help students</div>
            </div>
          </motion.div>
        )}

        {/* Progress */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                step >= s 
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white' 
                  : 'bg-gray-100 text-gray-400'
              }`}>
                {step > s ? <Check className="w-5 h-5" /> : s}
              </div>
              {s < 3 && (
                <div className={`w-12 h-1 mx-2 rounded ${step > s ? 'bg-amber-500' : 'bg-gray-200'}`} />
              )}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Card className="border-0 shadow-xl">
                <CardHeader className="text-center pb-2">
                  <CardTitle className="text-3xl">Become a Mentor</CardTitle>
                  <CardDescription className="text-lg">Share your college experience and get paid</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-base">Full Name</Label>
                    <Input
                      id="name"
                      placeholder="Your name"
                      value={formData.name}
                      onChange={(e) => updateForm('name', e.target.value)}
                      className="h-12 rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-base">Email (use your .edu email)</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@university.edu"
                      value={formData.email}
                      onChange={(e) => updateForm('email', e.target.value)}
                      className="h-12 rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="university" className="text-base">University</Label>
                    <Input
                      id="university"
                      placeholder="Your university name"
                      value={formData.university}
                      onChange={(e) => updateForm('university', e.target.value)}
                      className="h-12 rounded-xl"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="major" className="text-base">Major</Label>
                      <Input
                        id="major"
                        placeholder="Your major"
                        value={formData.major}
                        onChange={(e) => updateForm('major', e.target.value)}
                        className="h-12 rounded-xl"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-base">Year</Label>
                      <Select value={formData.year} onValueChange={(v) => updateForm('year', v)}>
                        <SelectTrigger className="h-12 rounded-xl">
                          <SelectValue placeholder="Select year" />
                        </SelectTrigger>
                        <SelectContent>
                          {YEARS.map((year) => (
                            <SelectItem key={year} value={year}>{year}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Card className="border-0 shadow-xl">
                <CardHeader className="text-center pb-2">
                  <CardTitle className="text-3xl">Your Expertise</CardTitle>
                  <CardDescription className="text-lg">What can you help high schoolers with?</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                  <div className="space-y-3">
                    <Label className="text-base">Your Interests & Expertise</Label>
                    <div className="flex flex-wrap gap-2">
                      {INTERESTS.map((interest) => (
                        <Badge
                          key={interest}
                          variant={formData.interests.includes(interest) ? 'default' : 'outline'}
                          className={`px-4 py-2 cursor-pointer rounded-full transition-all ${
                            formData.interests.includes(interest)
                              ? 'bg-amber-500 text-white hover:bg-amber-600'
                              : 'hover:bg-amber-50 hover:border-amber-300'
                          }`}
                          onClick={() => toggleInterest(interest)}
                        >
                          {interest}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="experience" className="text-base">Relevant Experience</Label>
                    <Textarea
                      id="experience"
                      placeholder="Clubs, internships, research, leadership positions, etc."
                      value={formData.experience}
                      onChange={(e) => updateForm('experience', e.target.value)}
                      className="rounded-xl min-h-[100px]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio" className="text-base">Short Bio (shown to high schoolers)</Label>
                    <Textarea
                      id="bio"
                      placeholder="Tell high schoolers a bit about yourself and what makes your college experience unique"
                      value={formData.bio}
                      onChange={(e) => updateForm('bio', e.target.value)}
                      className="rounded-xl min-h-[100px]"
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Card className="border-0 shadow-xl">
                <CardHeader className="text-center pb-2">
                  <CardTitle className="text-3xl">Final Details</CardTitle>
                  <CardDescription className="text-lg">Help us schedule your sessions</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                  <div className="space-y-2">
                    <Label htmlFor="availability" className="text-base">Your General Availability</Label>
                    <Textarea
                      id="availability"
                      placeholder="e.g., Weekday evenings after 7pm EST, weekends flexible"
                      value={formData.availability}
                      onChange={(e) => updateForm('availability', e.target.value)}
                      className="rounded-xl"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="calendly" className="text-base">Calendly Link (Optional)</Label>
                    <Input
                      id="calendly"
                      placeholder="https://calendly.com/yourlink"
                      value={formData.calendly_link}
                      onChange={(e) => updateForm('calendly_link', e.target.value)}
                      className="h-12 rounded-xl"
                    />
                    <p className="text-sm text-gray-500">If you don't have one, we'll help you set it up</p>
                  </div>

                  <div className="bg-green-50 rounded-2xl p-6 border border-green-100">
                    <h4 className="font-semibold text-green-800 mb-2">💰 How Payment Works</h4>
                    <p className="text-green-700 text-sm">
                      You'll earn $40 for each 45-minute mentoring session. Payments are processed after each completed call via your preferred method (Venmo, Zelle, or PayPal).
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <Button
            variant="ghost"
            onClick={() => setStep(step - 1)}
            disabled={step === 1}
            className="rounded-xl"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          {step < 3 ? (
            <Button
              onClick={() => setStep(step + 1)}
              disabled={!canProceed()}
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 rounded-xl px-6"
            >
              Continue
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 rounded-xl px-8"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  Submit Application
                  <Check className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}