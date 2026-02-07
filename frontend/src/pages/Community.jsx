import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import {airtableClient} from '@/api/airtableClient'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, TrendingUp, Plus, Heart, ThumbsUp, Users, Sparkles, Send } from 'lucide-react';
import Footer from '../components/landing/Footer';

const TAGS = ["Admissions", "Campus Life", "Academics", "Social", "Dorms", "Food", "Majors", "Advice"];

export default function Community() {
  const [filter, setFilter] = useState('all');
  const [selectedTag, setSelectedTag] = useState(null);
  const [newPostOpen, setNewPostOpen] = useState(false);
  const [newPost, setNewPost] = useState({ type: 'question', title: '', content: '', author_name: '', author_type: 'Student', tags: [], poll_options: [{ text: '', votes: 0 }, { text: '', votes: 0 }] });
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyContent, setReplyContent] = useState('');
  const [replyName, setReplyName] = useState('');
  const [replyType, setReplyType] = useState('Mentor');

  const queryClient = useQueryClient();

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ['community-posts'],
    queryFn: async () => {
        const res = await airtableClient.get("/community-posts");
        return res.data;
    },
  });

  const createPostMutation = useMutation({
    mutationFn: async (data) => {
        console.log("data"+JSON.stringify(data))
        const res = await airtableClient.post("/community-posts", data);
        return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['community-posts'] });
      setNewPostOpen(false);
      setNewPost({ type: 'question', title: '', content: '', author_name: '', author_type: 'Student', tags: [], poll_options: [{ text: '', votes: 0 }, { text: '', votes: 0 }] });
    }
  });

  const updatePostMutation = useMutation({
    mutationFn: async ({ id, data }) => {
        
        const res = await airtableClient.patch(`/community-posts/${id}`, data);
        return res.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['community-posts'] })
  });

  const handleVote = (post, optionIndex) => {
    const newOptions = [...post.poll_options];
    newOptions[optionIndex].votes = (newOptions[optionIndex].votes || 0) + 1;
    updatePostMutation.mutate({ id: post.id, data: { poll_options: newOptions } });
  };

  const handleLike = (post) => {
    updatePostMutation.mutate({ id: post.id, data: { likes: (post.likes || 0) + 1 } });
  };

  const handleReply = async (post) => {
    if (!replyContent.trim() || !replyName.trim()) return;
    
    await airtableClient.post("/answers", {
        postId: post.id,
        author_name: replyName,
        author_type: replyType,
        answer_text: replyContent,
      });
    queryClient.invalidateQueries({ queryKey: ['community-posts'] });  
    setReplyingTo(null);
    setReplyContent('');
    setReplyName('');
  };

  const filteredPosts = posts.filter(post => {
    if (filter !== 'all' && post.type !== filter) return false;
    if (selectedTag && !post.tags?.includes(selectedTag)) return false;
    return true;
  });

  const toggleTag = (tag) => {
    setNewPost(prev => ({
      ...prev,
      tags: prev.tags.includes(tag) ? prev.tags.filter(t => t !== tag) : [...prev.tags, tag]
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-50 to-white pt-24">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="inline-flex items-center gap-2 bg-violet-100 px-4 py-2 rounded-full mb-4">
            <Users className="w-4 h-4 text-violet-600" />
            <span className="text-sm font-medium text-violet-700">Community Space</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            College Q&A
          </h1>
          <p className="text-xl text-gray-600 max-w-xl mx-auto">
            Ask questions, share insights, and connect with other students navigating the college journey
          </p>
        </motion.div>

        {/* Filters & New Post */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
          <Tabs value={filter} onValueChange={setFilter}>
            <TabsList className="bg-white shadow-sm">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="Question">Questions</TabsTrigger>
              <TabsTrigger value="Poll">Polls</TabsTrigger>
              <TabsTrigger value="tip">Tips</TabsTrigger>
            </TabsList>
          </Tabs>

          <Dialog open={newPostOpen} onOpenChange={setNewPostOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 rounded-xl">
                <Plus className="w-4 h-4 mr-2" />
                New Post
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create a Post</DialogTitle>
              </DialogHeader>
              <div className="space-y-6 pt-4">
                <div className="space-y-2">
                  <Label>Post Type</Label>
                  <RadioGroup value={newPost.type} onValueChange={(v) => setNewPost(prev => ({ ...prev, type: v }))} className="flex gap-4">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Question" id="question" />
                      <Label htmlFor="question">Question</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Poll" id="poll" />
                      <Label htmlFor="poll">Poll</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Tip" id="tip" />
                      <Label htmlFor="tip">Tip</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label>Your Name</Label>
                  <Input
                    placeholder="Display name"
                    value={newPost.author_name}
                    onChange={(e) => setNewPost(prev => ({ ...prev, author_name: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label>I am a...</Label>
                  <RadioGroup value={newPost.author_type} onValueChange={(v) => setNewPost(prev => ({ ...prev, author_type: v }))} className="flex gap-4">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Student" id="hs" />
                      <Label htmlFor="hs">High Schooler</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Mentor" id="col" />
                      <Label htmlFor="col">College Student</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label>{newPost.type === 'poll' ? 'Poll Question' : 'Title'}</Label>
                  <Input
                    placeholder={newPost.type === 'poll' ? "What's your poll question?" : "What's your question or tip?"}
                    value={newPost.title}
                    onChange={(e) => setNewPost(prev => ({ ...prev, title: e.target.value }))}
                  />
                </div>

                {newPost.type === 'poll' && (
                  <div className="space-y-3">
                    <Label>Poll Options</Label>
                    {newPost.poll_options.map((opt, i) => (
                      <Input
                        key={i}
                        placeholder={`Option ${i + 1}`}
                        value={opt.text}
                        onChange={(e) => {
                          const newOpts = [...newPost.poll_options];
                          newOpts[i].text = e.target.value;
                          setNewPost(prev => ({ ...prev, poll_options: newOpts }));
                        }}
                      />
                    ))}
                    {newPost.poll_options.length < 4 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setNewPost(prev => ({ ...prev, poll_options: [...prev.poll_options, { text: '', votes: 0 }] }))}
                      >
                        Add Option
                      </Button>
                    )}
                  </div>
                )}

                {newPost.type !== 'poll' && (
                  <div className="space-y-2">
                    <Label>Details (optional)</Label>
                    <Textarea
                      placeholder="Add more context..."
                      value={newPost.content}
                      onChange={(e) => setNewPost(prev => ({ ...prev, content: e.target.value }))}
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label>Tags</Label>
                  <div className="flex flex-wrap gap-2">
                    {TAGS.map(tag => (
                      <Badge
                        key={tag}
                        variant={newPost.tags.includes(tag) ? 'default' : 'outline'}
                        className={`cursor-pointer ${newPost.tags.includes(tag) ? 'bg-violet-600' : ''}`}
                        onClick={() => toggleTag(tag)}
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Button
                  className="w-full bg-gradient-to-r from-violet-600 to-purple-600"
                  onClick={() => createPostMutation.mutate({ ...newPost, likes: 0, answers: [] })}
                  disabled={!newPost.title || !newPost.author_name || createPostMutation.isPending}
                >
                  Post
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Tags Filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          <Badge
            variant={selectedTag === null ? 'default' : 'outline'}
            className={`cursor-pointer ${selectedTag === null ? 'bg-violet-600' : ''}`}
            onClick={() => setSelectedTag(null)}
          >
            All Topics
          </Badge>
          {TAGS.map(tag => (
            <Badge
              key={tag}
              variant={selectedTag === tag ? 'default' : 'outline'}
              className={`cursor-pointer ${selectedTag === tag ? 'bg-violet-600' : ''}`}
              onClick={() => setSelectedTag(tag)}
            >
              {tag}
            </Badge>
          ))}
        </div>

        {/* Posts */}
        <div className="space-y-6">
          {isLoading ? (
            <div className="text-center py-12 text-gray-500">Loading posts...</div>
          ) : filteredPosts.length === 0 ? (
            <div className="text-center py-12">
              <Sparkles className="w-12 h-12 text-violet-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No posts yet</h3>
              <p className="text-gray-500">Be the first to start a conversation!</p>
            </div>
          ) : (
            <AnimatePresence>
              {filteredPosts.map((post) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            post.author_type === 'Mentor' 
                              ? 'bg-gradient-to-br from-amber-400 to-orange-400' 
                              : 'bg-gradient-to-br from-violet-400 to-purple-400'
                          }`}>
                            <span className="text-white font-semibold text-sm">
                              {post.author_name?.[0]?.toUpperCase() || '?'}
                            </span>
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{post.author_name}</p>
                            <p className="text-sm text-gray-500">
                              {post.author_type === 'Mentor' ? '🎓 College Student' : '📚 High School'}
                            </p>
                          </div>
                        </div>
                        <Badge variant="secondary" className={`${
                          post.type === 'Question' ? 'bg-blue-100 text-blue-700' :
                          post.type === 'Poll' ? 'bg-purple-100 text-purple-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {post.type === 'Question' ? '❓ Question' : post.type === 'Poll' ? '📊 Poll' : '💡 Tip'}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardTitle className="text-xl mb-3">{post.text}</CardTitle>
                      
                      {post.content && (
                        <p className="text-gray-600 mb-4">{post.content}</p>
                      )}

                      {/* Poll Options */}
                      {post.type === 'Poll' && post.poll_options && (
                        <div className="space-y-2 mb-4">
                          {post.poll_options.filter(o => o.text).map((option, i) => {
                            const totalVotes = post.poll_options.reduce((sum, o) => sum + (o.votes || 0), 0);
                            const percentage = totalVotes > 0 ? Math.round((option.votes / totalVotes) * 100) : 0;
                            
                            return (
                              <button
                                key={i}
                                onClick={() => handleVote(post, i)}
                                className="w-full relative overflow-hidden rounded-xl border-2 border-gray-100 hover:border-violet-200 transition-all p-3 text-left"
                              >
                                <div 
                                  className="absolute inset-0 bg-violet-100 transition-all"
                                  style={{ width: `${percentage}%` }}
                                />
                                <div className="relative flex justify-between items-center">
                                  <span className="font-medium">{option.text}</span>
                                  <span className="text-sm text-gray-500">{percentage}%</span>
                                </div>
                              </button>
                            );
                          })}
                          <p className="text-sm text-gray-500 text-center">
                            {post.poll_options.reduce((sum, o) => sum + (o.votes || 0), 0)} votes
                          </p>
                        </div>
                      )}

                      {/* Tags */}
                      {post.tags?.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {post.tags.map(tag => (
                            <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                          ))}
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex items-center gap-4 pt-4 border-t">
                        <button 
                          onClick={() => handleLike(post)}
                          className="flex items-center gap-2 text-gray-500 hover:text-pink-500 transition-colors"
                        >
                          <Heart className="w-5 h-5" />
                          <span>{post.likes || 0}</span>
                        </button>
                        <button 
                          onClick={() => setReplyingTo(replyingTo === post.id ? null : post.id)}
                          className="flex items-center gap-2 text-gray-500 hover:text-violet-500 transition-colors"
                        >
                          <MessageCircle className="w-5 h-5" />
                          <span>{post.answers?.length || 0} replies</span>
                        </button>
                      </div>

                      {/* Answers */}
                      {post.answers?.length > 0 && (
                        <div className="mt-4 space-y-3">
                          {post.answers.map((answer, i) => (
                            <div key={i} className="bg-gray-50 rounded-xl p-4 ml-6 border-l-4 border-violet-200">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="font-semibold text-sm">{answer.author_name}</span>
                                <span className="text-xs text-gray-500">
                                  {answer.author_type === 'Mentor' ? '🎓' : '📚'}
                                </span>
                              </div>
                              <p className="text-gray-700">{answer.answer_text}</p>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Reply Form */}
                      {replyingTo === post.id && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="mt-4 p-4 bg-violet-50 rounded-xl"
                        >
                          <div className="grid grid-cols-2 gap-3 mb-3">
                            <Input
                              placeholder="Your name"
                              value={replyName}
                              onChange={(e) => setReplyName(e.target.value)}
                            />
                            <select
                              value={replyType}
                              onChange={(e) => setReplyType(e.target.value)}
                              className="rounded-md border border-gray-200 px-3"
                            >
                              <option value="Mentor">College Student</option>
                              <option value="Student">High Schooler</option>
                            </select>
                          </div>
                          <div className="flex gap-2">
                            <Textarea
                              placeholder="Write your reply..."
                              value={replyContent}
                              onChange={(e) => setReplyContent(e.target.value)}
                              className="flex-1"
                            />
                            <Button 
                              onClick={() => handleReply(post)}
                              className="bg-violet-600 hover:bg-violet-700"
                            >
                              <Send className="w-4 h-4" />
                            </Button>
                          </div>
                        </motion.div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}