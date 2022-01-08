const mysql = require("mysql2");
const inquirer = require("inquirer");
require("console.table");

// Connect to database
const db = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: '', // <----------- Please add your SQL Password Here!!!!!!
  database: 'etrackerDB'
});

function startApp() {
  inquirer.prompt([
    {
      type: "list",
      message: "Choose what you want to do?",
      name: "choice",
      choices: [
        "View Departments?",
        "View Roles?",
        "View Employees?",
        "Add new Department?",
        "Add new Role?",
        "Add new Employee?",
        "Update Employee?",
        "Remove Employee?",
        "Remove Role?",
        "Remove Department?",
        "Exit"
      ]
    }
  ]).then(function (val) {
    switch (val.choice) {
      case "View Departments?":
        viewDepartments();
        break;

      case "View Roles?":
        viewRoles();
        break;

      case "View Employees?":
        viewEmployees();
        break;

      case "Add new Department?":
        addDepartment();
        break;

      case "Add new Role?":
        addRole();
        break;

      case "Add new Employee?":
        addEmployee();
        break;

      case "Update Employee?":
        updateEmployee();
        break;

      case "Remove Employee?":
        removeEmployee();
        break;

      case "Remove Role?":
        removeRole();
        break;

      case "Remove Department?":
        removeDepartment();
        break;

      case "Exit":
        db.end();
        break;
    }
  })
}

function viewDepartments() {
  db.query("SELECT department.id AS Department_ID, department.name AS Department FROM department;",
    function (err, res) {
      if (err) throw err
      console.table(res)
      startApp()
    })
}

var dArr = [];
function selectDepartment() {
  db.query("SELECT id, name FROM department", function (err, res) {
    if (err) throw err
    for (var i = 0; i < res.length; i++) {
      dArr.push(res[i].id);
    }
  })
  return dArr;
}

function viewRoles() {
  db.query("SELECT role.id AS Role_ID, role.title AS Job_Title, role.salary AS Salary, department.name as Department FROM role JOIN department ON role.department_id = department.id;",
    function (err, res) {
      if (err) throw err
      console.table(res)
      startApp()
    })
}

var rArr = [];
function selectRole() {
  db.query("SELECT id FROM role order by id", function (err, res) {
    if (err) throw err
    for (var i = 0; i < res.length; i++) {
      rArr.push(res[i].id);
    }
  })
  return rArr;
}

function viewEmployees() {
  db.query("SELECT employee.id AS Employee_ID, employee.first_name AS First_Name, employee.last_name AS Last_Name, role.title AS Job_Title, department.name AS Department, role.salary AS Salary, CONCAT(e.first_name, ' ' ,e.last_name) AS Manager FROM employee INNER JOIN role on role.id = employee.role_id INNER JOIN department on department.id = role.department_id left join employee e on employee.manager_id = e.id;",
    function (err, res) {
      if (err) throw err
      console.table(res)
      startApp()
    })
}

var eArr = [];
function selectEmployee() {
  db.query("SELECT id FROM employee order by id", function (err, res) {
    if (err) throw err
    for (var i = 0; i < res.length; i++) {
      eArr.push(res[i].id);
    }
  })
  return eArr;
}

function addDepartment() {
  inquirer.prompt([
    {
      name: "name",
      type: "input",
      message: "Name your new Department!"
    }
  ]).then(function (res) {
    var query = db.query(
      "INSERT INTO department SET ?",
      {
        name: res.name
      },
      function (err) {
        if (err) throw err
        console.table(res);
        viewDepartments();
      }
    )
  })
}

function addRole() {
  db.query("SELECT role.title AS Title, role.salary AS Salary FROM role", function (err, res) {
    inquirer.prompt([
      {
        name: "Title",
        type: "input",
        message: "What is the Title of this role?"
      },
      {
        name: "Salary",
        type: "input",
        message: "What is the Salary of this role?"
      },
      {
        name: "Department",
        type: "list",
        message: "What department does this role belong to?",
        choices: selectDepartment()
      },
    ]).then(function (res) {
      db.query(
        "INSERT INTO role SET ?",
        {
          title: res.Title,
          salary: res.Salary,
          department_id: res.Department
        },
        function (err) {
          if (err) throw err
          console.table(res);
          viewRoles();
        }
      )
    });
  });
}

function addEmployee() {
  db.query("SELECT * from employee", function (err, res) {
    inquirer.prompt([
      {
        name: "firstName",
        type: "input",
        message: "Enter employee's first name!"
      },
      {
        name: "lastName",
        type: "input",
        message: "Enter employee's last name!"
      },
      {
        name: "role",
        type: "list",
        message: "What is this employee's role?",
        choices: selectRole()
      },
      {
        name: "manager",
        type: "list",
        message: "Who will be this employee's manager?",
        choices: selectEmployee()
      },
    ]).then(function (res) {
      db.query("INSERT INTO employee SET ?",
        {
          first_name: res.firstName,
          last_name: res.lastName,
          role_id: res.role,
          manager_id: res.manager
        },
        function (err) {
          if (err) throw err
          console.table(res);
          viewEmployees();
        }
      )
    });
  });
}

// updateEmployee function error >>>>>>>>>>>>>>>>>>
function updateEmployee() {
  db.query("SELECT * from employee", function (err, res) {
    inquirer.prompt([
      {
        name: "employee",
        type: "list",
        message: "Select an employee to update by selecting their employee_ID!",
        choices: selectEmployee()
      },
      {
        name: "role",
        type: "list",
        message: "What should their new role be?",
        choices: selectRole()
      }
    ]).then(function (res) {
      // Modify >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
      db.query('UPDATE employee SET ? WHERE id = ?',
        [{
          role_id: res.role
        },
        {
          id: res.employee
        }],
        function (err) {
          if (err) throw err
          console.table(res);
          viewEmployees();
        }
      )
    });
  });
}

function removeEmployee() {
  db.query("SELECT * from employee", function (err, res) {
    inquirer.prompt([
      {
        name: "employee",
        type: "list",
        message: "Select an employee to delete by selecting their employee ID!",
        choices: selectEmployee()
      }
    ]).then(function (res) {
      db.query('DELETE FROM employee WHERE ?',
        {
          id: res.employee
        },
        function (err) {
          if (err) throw err
          console.table(res);
          viewEmployees();
        }
      )
    });
  });
}

function removeRole() {
  db.query("SELECT * from role", function (err, res) {
    inquirer.prompt([
      {
        name: "role",
        type: "list",
        message: "Select a role to delete by selecting the associated Role ID!",
        choices: selectRole()
      }
    ]).then(function (res) {
      db.query('DELETE FROM role WHERE ?',
        {
          id: res.role
        },
        function (err) {
          if (err) throw err
          console.table(res);
          viewRoles();
        }
      )
    });
  });
}

function removeDepartment() {
  db.query("SELECT * from department", function (err, res) {
    inquirer.prompt([
      {
        name: "department",
        type: "list",
        message: "Select a department to delete by selecting the Department ID!",
        choices: selectDepartment()
      }
    ]).then(function (res) {
      db.query('DELETE FROM department WHERE ?',
        {
          id: res.department
        },
        function (err) {
          if (err) throw err
          console.table(res);
          viewDepartments();
        }
      )
    });
  });
}

// Start server after DB connection
db.connect(err => {
  if (err) throw err;
  console.log('Database connected! Thread_ID: ' + db.threadId);
  startApp();
});
