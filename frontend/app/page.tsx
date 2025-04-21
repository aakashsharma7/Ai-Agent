'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Upload, FileText, Briefcase, CheckCircle, AlertCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import { AnimatedCard } from '@/components/ui/animated-card'
import { AnimatedButton } from '@/components/ui/animated-button'
import { AnimatedTabs, AnimatedTabsList, AnimatedTabsTrigger, AnimatedTabsContent } from '@/components/ui/animated-tabs'

export default function Home() {
  const [jobDescription, setJobDescription] = useState('')
  const [resume, setResume] = useState('')
  const [results, setResults] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [fileError, setFileError] = useState<string | null>(null)
  const [fileLoading, setFileLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('analyze')

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    setFileError(null)
    
    if (!file) {
      return;
    }
    
    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setFileError("File size exceeds 5MB limit");
      return;
    }
    
    // Check file type
    const allowedTypes = ['.txt', '.doc', '.docx', '.pdf'];
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    
    if (!allowedTypes.includes(fileExtension)) {
      setFileError("Invalid file type. Please upload a .txt, .doc, .docx, or .pdf file");
      return;
    }
    
    setSelectedFile(file);
    setFileLoading(true);
    
    try {
      const text = await file.text();
      setResume(text);
      setFileError(null);
    } catch (error) {
      console.error('Error reading file:', error);
      setFileError("Failed to read file. Please try again or use a different file.");
    } finally {
      setFileLoading(false);
    }
  }

  const analyzeJob = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/analyze-job', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: jobDescription }),
      })
      const data = await response.json()
      setResults(data)
    } catch (error) {
      console.error('Error:', error)
    }
    setLoading(false)
  }

  const matchResume = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/match-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: resume, job_description: jobDescription }),
      })
      const data = await response.json()
      setResults(data)
    } catch (error) {
      console.error('Error:', error)
    }
    setLoading(false)
  }

  const optimizeApplication = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/optimize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: resume, job_description: jobDescription }),
      })
      const data = await response.json()
      setResults(data)
    } catch (error) {
      console.error('Error:', error)
    }
    setLoading(false)
  }

  const generateCoverLetter = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/generate-cover-letter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: resume, job_description: jobDescription }),
      })
      const data = await response.json()
      setResults(data)
    } catch (error) {
      console.error('Error:', error)
    }
    setLoading(false)
  }

  return (
    <div className="container mx-auto py-10">
      <motion.h1 
        className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Job Application Optimizer
      </motion.h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <AnimatedCard delay={0.1}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              Job Description
            </CardTitle>
            <CardDescription>Paste the job description here</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Enter job description..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              className="min-h-[200px]"
            />
          </CardContent>
        </AnimatedCard>

        <AnimatedCard delay={0.2}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Your Resume
            </CardTitle>
            <CardDescription>Upload your resume file</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <label className="flex-1">
                  <div className="flex items-center justify-center w-full h-32 px-4 transition bg-white border-2 border-gray-300 border-dashed rounded-md appearance-none cursor-pointer hover:border-gray-400 focus:outline-none">
                    <div className="flex flex-col items-center space-y-2">
                      <Upload className="w-8 h-8 text-gray-400" />
                      <span className="font-medium text-gray-600">
                        Drop files to Attach, or{" "}
                        <span className="text-blue-600 underline">browse</span>
                      </span>
                      <span className="text-xs text-gray-500">(TXT, DOC, DOCX, PDF up to 5MB)</span>
                    </div>
                    <Input
                      type="file"
                      accept=".txt,.doc,.docx,.pdf"
                      onChange={handleFileChange}
                      className="hidden"
                      disabled={fileLoading}
                    />
                  </div>
                </label>
                {fileLoading && <Loader2 className="h-4 w-4 animate-spin" />}
              </div>
              
              {selectedFile && !fileError && (
                <motion.div 
                  className="flex items-center gap-2 text-sm text-green-600"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <CheckCircle className="h-4 w-4" />
                  <span>Selected file: {selectedFile.name}</span>
                </motion.div>
              )}
              
              {fileError && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{fileError}</AlertDescription>
                  </Alert>
                </motion.div>
              )}
              
              {resume && !fileError && (
                <motion.div 
                  className="text-sm text-muted-foreground"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.3 }}
                >
                  Resume content loaded successfully
                </motion.div>
              )}
            </div>
          </CardContent>
        </AnimatedCard>
      </div>

      <AnimatedTabs defaultValue="analyze" className="w-full" value={activeTab} onValueChange={setActiveTab}>
        <AnimatedTabsList className="grid w-full grid-cols-4">
          <AnimatedTabsTrigger value="analyze">Analyze Job</AnimatedTabsTrigger>
          <AnimatedTabsTrigger value="match">Match Resume</AnimatedTabsTrigger>
          <AnimatedTabsTrigger value="optimize">Optimize</AnimatedTabsTrigger>
          <AnimatedTabsTrigger value="cover-letter">Cover Letter</AnimatedTabsTrigger>
        </AnimatedTabsList>

        <AnimatedTabsContent value="analyze">
          <AnimatedCard>
            <CardHeader>
              <CardTitle>Job Analysis</CardTitle>
              <CardDescription>Get insights about the job requirements</CardDescription>
            </CardHeader>
            <CardContent>
              <AnimatedButton 
                onClick={analyzeJob} 
                disabled={loading || !jobDescription}
                isLoading={loading}
              >
                {loading ? 'Analyzing...' : 'Analyze Job'}
              </AnimatedButton>
              {results && (
                <motion.div 
                  className="mt-4 p-4 bg-muted rounded-lg"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  {activeTab === 'analyze' && results.analysis && !results.error ? (
                    <div className="space-y-4">
                      {results.analysis["Key Responsibilities"] && (
                        <div>
                          <h3 className="font-semibold text-lg mb-2">Key Responsibilities</h3>
                          <ul className="list-disc pl-5 space-y-1">
                            {results.analysis["Key Responsibilities"].map((item: string, index: number) => (
                              <li key={index}>{item}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {results.analysis["Required Skills and Qualifications"] && (
                        <div>
                          <h3 className="font-semibold text-lg mb-2">Required Skills and Qualifications</h3>
                          <ul className="list-disc pl-5 space-y-1">
                            {results.analysis["Required Skills and Qualifications"].map((item: string, index: number) => (
                              <li key={index}>{item}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {results.analysis["Preferred Skills and Qualifications"] && (
                        <div>
                          <h3 className="font-semibold text-lg mb-2">Preferred Skills and Qualifications</h3>
                          <ul className="list-disc pl-5 space-y-1">
                            {results.analysis["Preferred Skills and Qualifications"].map((item: string, index: number) => (
                              <li key={index}>{item}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {results.analysis["Industry and Role Type"] && (
                        <div>
                          <h3 className="font-semibold text-lg mb-2">Industry and Role Type</h3>
                          <ul className="list-disc pl-5 space-y-1">
                            {results.analysis["Industry and Role Type"].map((item: string, index: number) => (
                              <li key={index}>{item}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {results.analysis["Experience Level"] && (
                        <div>
                          <h3 className="font-semibold text-lg mb-2">Experience Level</h3>
                          <ul className="list-disc pl-5 space-y-1">
                            {Array.isArray(results.analysis["Experience Level"]) 
                              ? results.analysis["Experience Level"].map((item: string, index: number) => (
                                  <li key={index}>{item}</li>
                                ))
                              : <li>{results.analysis["Experience Level"]}</li>
                            }
                          </ul>
                        </div>
                      )}
                      
                      {results.analysis["Key Keywords for Optimization"] && (
                        <div>
                          <h3 className="font-semibold text-lg mb-2">Key Keywords for Optimization</h3>
                          <div className="flex flex-wrap gap-2">
                            {results.analysis["Key Keywords for Optimization"].map((item: string, index: number) => (
                              <span key={index} className="px-2 py-1 bg-primary/10 rounded-md text-sm">
                                {item}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <pre className="whitespace-pre-wrap">{JSON.stringify(results, null, 2)}</pre>
                  )}
                </motion.div>
              )}
            </CardContent>
          </AnimatedCard>
        </AnimatedTabsContent>

        <AnimatedTabsContent value="match">
          <AnimatedCard>
            <CardHeader>
              <CardTitle>Resume Matching</CardTitle>
              <CardDescription>See how well your resume matches the job</CardDescription>
            </CardHeader>
            <CardContent>
              <AnimatedButton 
                onClick={matchResume} 
                disabled={loading || !jobDescription || !resume}
                isLoading={loading}
              >
                {loading ? 'Matching...' : 'Match Resume'}
              </AnimatedButton>
              {results && (
                <motion.div 
                  className="mt-4 p-4 bg-muted rounded-lg"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <pre className="whitespace-pre-wrap">{JSON.stringify(results, null, 2)}</pre>
                </motion.div>
              )}
            </CardContent>
          </AnimatedCard>
        </AnimatedTabsContent>

        <AnimatedTabsContent value="optimize">
          <AnimatedCard>
            <CardHeader>
              <CardTitle>Optimization</CardTitle>
              <CardDescription>Get suggestions to improve your application</CardDescription>
            </CardHeader>
            <CardContent>
              <AnimatedButton 
                onClick={optimizeApplication} 
                disabled={loading || !jobDescription || !resume}
                isLoading={loading}
              >
                {loading ? 'Optimizing...' : 'Optimize Application'}
              </AnimatedButton>
              {results && (
                <motion.div 
                  className="mt-4 p-4 bg-muted rounded-lg"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <pre className="whitespace-pre-wrap">{JSON.stringify(results, null, 2)}</pre>
                </motion.div>
              )}
            </CardContent>
          </AnimatedCard>
        </AnimatedTabsContent>

        <AnimatedTabsContent value="cover-letter">
          <AnimatedCard>
            <CardHeader>
              <CardTitle>Cover Letter</CardTitle>
              <CardDescription>Generate a customized cover letter</CardDescription>
            </CardHeader>
            <CardContent>
              <AnimatedButton 
                onClick={generateCoverLetter} 
                disabled={loading || !jobDescription || !resume}
                isLoading={loading}
              >
                {loading ? 'Generating...' : 'Generate Cover Letter'}
              </AnimatedButton>
              {results && (
                <motion.div 
                  className="mt-4 p-4 bg-muted rounded-lg"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <pre className="whitespace-pre-wrap">{JSON.stringify(results, null, 2)}</pre>
                </motion.div>
              )}
            </CardContent>
          </AnimatedCard>
        </AnimatedTabsContent>
      </AnimatedTabs>
    </div>
  )
}
