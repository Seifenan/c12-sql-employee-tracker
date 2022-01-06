INSERT INTO department (name)
VALUES 
  ('Marketing'),
  ('Sales'),
  ('Legal'),
  ('HR');

INSERT INTO role (title, salary, department_id)
VALUES
  1('CEO', 170000, 1),
  2('Marketing Manager', 130000, 1),
  3('Marketing Assistant', 80000, 1),
  4('Sales Manager', 110000, 2),
  5('Sales Assistant', 75000, 2),
  6('Legal Manager', 120000, 3),
  7('Legal Assistant', 75000, 3),
  8('HR Manager', 100000, 4),
  9('HR Assistant', 70000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
  ('Seif', 'Enan', 1, NULL),
  ('Ronald', 'Firbank', 2, 1),
  ('Virginia', 'Woolf', 3, 2),
  ('Piers', 'Gaveston', 3, 2),
  ('Charles', 'LeRoi', 4, 1),
  ('Katherine', 'Mansfield', 5, 3),
  ('Dora', 'Carrington', 6, 1),
  ('Edward', 'Bellamy', 7, 4),
  ('Montague', 'Summers', 8, 1),
  ('Octavia', 'Butler', 9, 5);
