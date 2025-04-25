SELECT 
    COALESCE(MAX(roll_no), 1000) + 1 AS next_roll 
FROM sb.students;
