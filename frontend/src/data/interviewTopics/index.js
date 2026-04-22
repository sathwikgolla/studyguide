import data from './generated.json'

export function getInterviewTopic(topicId) {
  return data.topics[topicId] ?? null
}

export const interviewTopicIds = ['os', 'cn', 'dbms', 'fullstack']
