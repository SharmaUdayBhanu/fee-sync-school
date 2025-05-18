
# DMS Fee Management System

## Supabase Integration Instructions

To enable full functionality with database connectivity, follow these steps:

### 1. Connect your Lovable Project to Supabase:

1. Click on the green Supabase button in the top right corner of the Lovable interface
2. Follow the prompts to connect your project to Supabase
3. Once connected, the app will automatically use your Supabase instance instead of mock data

### 2. Create Tables in Supabase

After connecting to Supabase, create the following tables using SQL or the Supabase Dashboard:

#### Students Table
```sql
CREATE TABLE students (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  guardianName TEXT NOT NULL,
  rollNumber TEXT NOT NULL,
  className TEXT NOT NULL,
  admissionDate DATE NOT NULL,
  feeStatus TEXT NOT NULL CHECK (feeStatus IN ('paid', 'partial', 'unpaid')),
  paidAmount INTEGER NOT NULL,
  totalAmount INTEGER NOT NULL,
  lastPaymentDate TEXT,
  monthlyFeeStatus JSONB NOT NULL DEFAULT '{}'::JSONB,
  address TEXT,
  phone TEXT,
  email TEXT,
  gender TEXT,
  dob TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX students_className_idx ON students (className);
CREATE INDEX students_feeStatus_idx ON students (feeStatus);
```

#### Classes Table
```sql
CREATE TABLE classes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL,
  teacher TEXT NOT NULL,
  studentsCount INTEGER NOT NULL DEFAULT 0,
  totalFees INTEGER NOT NULL DEFAULT 0,
  collectedFees INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Fee Structure Table
```sql
CREATE TABLE fee_structure (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  class TEXT UNIQUE NOT NULL,
  monthlyFee INTEGER NOT NULL,
  admissionFee INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Fee Types Table
```sql
CREATE TABLE fee_types (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('monthly', 'admission', 'other')),
  dueDate DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Payments Table
```sql
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  studentId UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  feeTypeId UUID NOT NULL REFERENCES fee_types(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL,
  paymentDate DATE NOT NULL,
  paymentMode TEXT NOT NULL,
  receiptNumber TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 3. Set up Row Level Security (RLS)

Enable Row Level Security for all tables and create policies to allow authenticated users to access the data.

### 4. Seed Initial Data

```sql
-- Insert initial classes
INSERT INTO classes (name, teacher, studentsCount, totalFees, collectedFees)
SELECT 
  class_name,
  'Teacher ' || ROW_NUMBER() OVER () as teacher,
  0,
  0,
  0
FROM UNNEST(ARRAY[
  'Pre-Nursery', 'Nursery', 'Lower KG', 'Upper KG',
  '1st', '2nd', '3rd', '4th', '5th',
  '6th', '7th', '8th', '9th', '10th'
]) as class_name;

-- Insert initial fee structure
INSERT INTO fee_structure (class, monthlyFee, admissionFee)
VALUES 
  ('Pre-Nursery', 1500, 5000),
  ('Nursery', 1800, 5000),
  ('Lower KG', 2000, 5000),
  ('Upper KG', 2200, 5000),
  ('1st', 2500, 6000),
  ('2nd', 2500, 6000),
  ('3rd', 2800, 6000),
  ('4th', 2800, 6000),
  ('5th', 3000, 7000),
  ('6th', 3500, 7000),
  ('7th', 3500, 7000),
  ('8th', 4000, 8000),
  ('9th', 4500, 8000),
  ('10th', 5000, 8000);
```

## Mobile App Setup (Android)

To convert this web app to an Android app:

1. **Export to GitHub**:
   - Click on the GitHub button in the top right of the interface
   - Follow the prompts to export to a new or existing repository

2. **Clone the repository** to your local machine:
   ```
   git clone <your-repo-url>
   cd <repo-directory>
   ```

3. **Install dependencies**:
   ```
   npm install
   ```

4. **Add Android platform**:
   ```
   npx cap add android
   ```

5. **Build the project**:
   ```
   npm run build
   ```

6. **Sync with Capacitor**:
   ```
   npx cap sync
   ```

7. **Open in Android Studio**:
   ```
   npx cap open android
   ```

8. In Android Studio, you can run the app on an emulator or physical device

## Updating the App

Whenever you make changes to the code:

1. Build the app: `npm run build`
2. Sync with Capacitor: `npx cap sync`
3. Open in Android Studio: `npx cap open android`

## Troubleshooting

If the app displays mock data even after connecting to Supabase:

1. Make sure you've connected your Lovable project to Supabase using the Supabase button on the top right
2. Check that your tables are set up correctly in Supabase following the SQL instructions above
3. Ensure your RLS policies allow the app to access the data
4. Try refreshing the app and checking the console logs for errors
