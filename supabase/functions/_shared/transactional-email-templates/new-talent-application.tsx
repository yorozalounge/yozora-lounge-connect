import * as React from 'npm:react@18.3.1'
import {
  Body, Container, Head, Heading, Html, Preview, Text, Hr,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

const SITE_NAME = "Yozora Lounge"

interface Props {
  applicantName?: string
  stageName?: string
  email?: string
  country?: string
  languages?: string
}

const NewTalentApplicationEmail = ({ applicantName, stageName, email, country, languages }: Props) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>New talent application from {applicantName || 'a new applicant'}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>New Talent Application</Heading>
        <Text style={text}>
          A new talent has submitted an application on {SITE_NAME}.
        </Text>
        <Hr style={hr} />
        <Text style={detail}><strong>Name:</strong> {applicantName || '—'}</Text>
        <Text style={detail}><strong>Stage Name:</strong> {stageName || '—'}</Text>
        <Text style={detail}><strong>Email:</strong> {email || '—'}</Text>
        <Text style={detail}><strong>Country:</strong> {country || '—'}</Text>
        <Text style={detail}><strong>Languages:</strong> {languages || '—'}</Text>
        <Hr style={hr} />
        <Text style={text}>
          Please review this application in the admin dashboard.
        </Text>
        <Text style={footer}>— {SITE_NAME} Platform</Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: NewTalentApplicationEmail,
  subject: (data: Record<string, any>) => `New talent application: ${data.applicantName || 'New Applicant'}`,
  displayName: 'New talent application notification',
  previewData: { applicantName: 'Sophia', stageName: 'Luna', email: 'sophia@example.com', country: 'France', languages: 'English, French' },
} satisfies TemplateEntry
