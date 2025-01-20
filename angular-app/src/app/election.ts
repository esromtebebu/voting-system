export interface Election {
    electionDates: {
        registrationStart: Date;
        registrationEnd: Date;
        votingStart: Date;
        votingEnd: Date;
      };
      name: string;
      electionId: string;
      candidates: Array<{
        primaryCandidate: {
          primaryCandidateFirstName: string;
          primaryCandidateLastName: string;
          primaryCandidateRole: string;
        };
        secondaryCandidate: {
          secondaryCandidateFirstName: string;
          secondaryCandidateLastName: string;
          secondaryCandidateRole: string;
        };
        candidateId: string;
        party: string;
        votes: number;
      }>;
}
