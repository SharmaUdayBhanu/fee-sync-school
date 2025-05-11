
// Define academic year and terms
export type AcademicYear = {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  terms: Term[];
};

export type Term = {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  academicYearId: string;
  exams: Exam[];
  feeDeadline: string;
};

export type Exam = {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  termId: string;
  classes: string[];
};

// Generate mock academic data
const generateMockAcademicData = (): AcademicYear[] => {
  const currentYear = new Date().getFullYear();
  
  return [
    {
      id: "1",
      name: `${currentYear}-${currentYear+1}`,
      startDate: `${currentYear}-04-01`,
      endDate: `${currentYear+1}-03-31`,
      isActive: true,
      terms: [
        {
          id: "1-1",
          name: "Term 1",
          startDate: `${currentYear}-04-01`,
          endDate: `${currentYear}-08-31`,
          academicYearId: "1",
          exams: [
            {
              id: "1-1-1",
              name: "Mid-Term Examination",
              startDate: `${currentYear}-06-15`,
              endDate: `${currentYear}-06-25`,
              termId: "1-1",
              classes: ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th']
            }
          ],
          feeDeadline: `${currentYear}-04-15`
        },
        {
          id: "1-2",
          name: "Term 2",
          startDate: `${currentYear}-09-01`,
          endDate: `${currentYear+1}-01-31`,
          academicYearId: "1",
          exams: [
            {
              id: "1-2-1",
              name: "Half-Yearly Examination",
              startDate: `${currentYear}-10-15`,
              endDate: `${currentYear}-10-25`,
              termId: "1-2",
              classes: ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th']
            }
          ],
          feeDeadline: `${currentYear}-09-15`
        },
        {
          id: "1-3",
          name: "Term 3",
          startDate: `${currentYear+1}-02-01`,
          endDate: `${currentYear+1}-03-31`,
          academicYearId: "1",
          exams: [
            {
              id: "1-3-1",
              name: "Annual Examination",
              startDate: `${currentYear+1}-03-01`,
              endDate: `${currentYear+1}-03-15`,
              termId: "1-3",
              classes: ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th']
            }
          ],
          feeDeadline: `${currentYear+1}-02-15`
        }
      ]
    },
    {
      id: "2",
      name: `${currentYear+1}-${currentYear+2}`,
      startDate: `${currentYear+1}-04-01`,
      endDate: `${currentYear+2}-03-31`,
      isActive: false,
      terms: [
        {
          id: "2-1",
          name: "Term 1",
          startDate: `${currentYear+1}-04-01`,
          endDate: `${currentYear+1}-08-31`,
          academicYearId: "2",
          exams: [],
          feeDeadline: `${currentYear+1}-04-15`
        },
        {
          id: "2-2",
          name: "Term 2",
          startDate: `${currentYear+1}-09-01`,
          endDate: `${currentYear+2}-01-31`,
          academicYearId: "2",
          exams: [],
          feeDeadline: `${currentYear+1}-09-15`
        },
        {
          id: "2-3",
          name: "Term 3",
          startDate: `${currentYear+2}-02-01`,
          endDate: `${currentYear+2}-03-31`,
          academicYearId: "2",
          exams: [],
          feeDeadline: `${currentYear+2}-02-15`
        }
      ]
    }
  ];
};

// Generate initial mock data
let mockAcademicYears = generateMockAcademicData();

// CRUD operations for academic data
export const getAllAcademicYears = (): AcademicYear[] => {
  return mockAcademicYears;
};

export const getAcademicYearById = (id: string): AcademicYear | undefined => {
  return mockAcademicYears.find(year => year.id === id);
};

export const getCurrentAcademicYear = (): AcademicYear | undefined => {
  return mockAcademicYears.find(year => year.isActive);
};

export const addAcademicYear = (academicYear: Omit<AcademicYear, 'id'>): AcademicYear => {
  const newId = (mockAcademicYears.length + 1).toString();
  
  const newAcademicYear = {
    id: newId,
    ...academicYear
  };
  
  mockAcademicYears = [...mockAcademicYears, newAcademicYear];
  return newAcademicYear;
};

export const updateAcademicYear = (updatedYear: AcademicYear): AcademicYear => {
  mockAcademicYears = mockAcademicYears.map(year => 
    year.id === updatedYear.id ? updatedYear : year
  );
  
  return updatedYear;
};

export const setActiveAcademicYear = (id: string): AcademicYear | undefined => {
  mockAcademicYears = mockAcademicYears.map(year => ({
    ...year,
    isActive: year.id === id
  }));
  
  return mockAcademicYears.find(year => year.id === id);
};

export const getTermById = (academicYearId: string, termId: string): Term | undefined => {
  const academicYear = mockAcademicYears.find(year => year.id === academicYearId);
  return academicYear?.terms.find(term => term.id === termId);
};

export const getCurrentTerm = (): Term | undefined => {
  const currentYear = getCurrentAcademicYear();
  if (!currentYear) return undefined;
  
  const today = new Date();
  return currentYear.terms.find(term => {
    const startDate = new Date(term.startDate);
    const endDate = new Date(term.endDate);
    return today >= startDate && today <= endDate;
  });
};

export const addTerm = (academicYearId: string, term: Omit<Term, 'id' | 'academicYearId'>): Term | undefined => {
  const yearIndex = mockAcademicYears.findIndex(year => year.id === academicYearId);
  
  if (yearIndex === -1) return undefined;
  
  const academicYear = mockAcademicYears[yearIndex];
  const newTermId = `${academicYearId}-${academicYear.terms.length + 1}`;
  
  const newTerm: Term = {
    id: newTermId,
    academicYearId,
    ...term,
    exams: []
  };
  
  mockAcademicYears[yearIndex] = {
    ...academicYear,
    terms: [...academicYear.terms, newTerm]
  };
  
  return newTerm;
};

export const updateTerm = (term: Term): Term | undefined => {
  const yearIndex = mockAcademicYears.findIndex(year => year.id === term.academicYearId);
  
  if (yearIndex === -1) return undefined;
  
  const academicYear = mockAcademicYears[yearIndex];
  const termIndex = academicYear.terms.findIndex(t => t.id === term.id);
  
  if (termIndex === -1) return undefined;
  
  const updatedTerms = [...academicYear.terms];
  updatedTerms[termIndex] = term;
  
  mockAcademicYears[yearIndex] = {
    ...academicYear,
    terms: updatedTerms
  };
  
  return term;
};

// Utility function to reset data (for testing)
export const resetAcademicData = () => {
  mockAcademicYears = generateMockAcademicData();
};
