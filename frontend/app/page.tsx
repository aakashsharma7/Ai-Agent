'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2 } from 'lucide-react'

export default function Home() {
  const [jobDescription, setJobDescription] = useState('')
  const [resume, setResume] = useState('')
  const [results, setResults] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [fileError, setFileError] = useState<string | null>(null)
  const [fileLoading, setFileLoading] = useState(false)

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
      <h1 className="text-4xl font-bold text-center mb-8">Job Application Optimizer</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Job Description</CardTitle>
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
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Your Resume</CardTitle>
            <CardDescription>Upload your resume file</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Input
                  type="file"
                  accept=".txt,.doc,.docx,.pdf"
                  onChange={handleFileChange}
                  className="cursor-pointer"
                  disabled={fileLoading}
                />
                {fileLoading && <Loader2 className="h-4 w-4 animate-spin" />}
              </div>
              
              {selectedFile && !fileError && (
                <div className="text-sm text-green-600">
                  Selected file: {selectedFile.name}
                </div>
              )}
              
              {fileError && (
                <Alert variant="destructive">
                  <AlertDescription>{fileError}</AlertDescription>
                </Alert>
              )}
              
              {resume && !fileError && (
                <div className="text-sm text-muted-foreground">
                  Resume content loaded successfully
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="analyze" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="analyze">Analyze Job</TabsTrigger>
          <TabsTrigger value="match">Match Resume</TabsTrigger>
          <TabsTrigger value="optimize">Optimize</TabsTrigger>
          <TabsTrigger value="cover-letter">Cover Letter</TabsTrigger>
        </TabsList>

        <TabsContent value="analyze">
          <Card>
            <CardHeader>
              <CardTitle>Job Analysis</CardTitle>
              <CardDescription>Get insights about the job requirements</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={analyzeJob} disabled={loading || !jobDescription}>
                {loading ? 'Analyzing...' : 'Analyze Job'}
              </Button>
              {results && (
                <div className="mt-4 p-4 bg-muted rounded-lg">
                  <pre className="whitespace-pre-wrap">{JSON.stringify(results, null, 2)}</pre>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="match">
          <Card>
            <CardHeader>
              <CardTitle>Resume Matching</CardTitle>
              <CardDescription>See how well your resume matches the job</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={matchResume} disabled={loading || !jobDescription || !resume}>
                {loading ? 'Matching...' : 'Match Resume'}
              </Button>
              {results && (
                <div className="mt-4 p-4 bg-muted rounded-lg">
                  <pre className="whitespace-pre-wrap">{JSON.stringify(results, null, 2)}</pre>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="optimize">
          <Card>
            <CardHeader>
              <CardTitle>Optimization</CardTitle>
              <CardDescription>Get suggestions to improve your application</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={optimizeApplication} disabled={loading || !jobDescription || !resume}>
                {loading ? 'Optimizing...' : 'Optimize Application'}
              </Button>
              {results && (
                <div className="mt-4 p-4 bg-muted rounded-lg">
                  <pre className="whitespace-pre-wrap">{JSON.stringify(results, null, 2)}</pre>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cover-letter">
          <Card>
            <CardHeader>
              <CardTitle>Cover Letter</CardTitle>
              <CardDescription>Generate a customized cover letter</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={generateCoverLetter} disabled={loading || !jobDescription || !resume}>
                {loading ? 'Generating...' : 'Generate Cover Letter'}
              </Button>
              {results && (
                <div className="mt-4 p-4 bg-muted rounded-lg">
                  <pre className="whitespace-pre-wrap">{JSON.stringify(results, null, 2)}</pre>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
