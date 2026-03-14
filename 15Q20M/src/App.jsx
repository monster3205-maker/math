// ═══════════════════════════════════════════════════════════════
// VIEW: 루트 App 컴포넌트
// useAppVM 하나만 호출하여 전체 상태를 받고, 현재 mode/page에
// 맞는 페이지 컴포넌트를 렌더링합니다.
// 비즈니스 로직은 없고 라우팅과 props 전달만 담당합니다.
// ═══════════════════════════════════════════════════════════════
import { useAppVM } from './viewmodels/useAppVM.js';

import { Sidebar }       from './views/layout/Sidebar.jsx';
import { LoginPage }     from './views/pages/LoginPage.jsx';
import { StudentExam }   from './views/pages/StudentExam.jsx';
import { Dashboard }     from './views/pages/Dashboard.jsx';
import { AssignPage }    from './views/pages/AssignPage.jsx';
import { StudentList }   from './views/pages/StudentList.jsx';
import { StudentDetail } from './views/pages/StudentDetail.jsx';
import { TestEntry }     from './views/pages/TestEntry.jsx';
import { RecordsPage }   from './views/pages/RecordsPage.jsx';
import { PaperMgmt }     from './views/pages/PaperMgmt.jsx';
import { Analytics }     from './views/pages/Analytics.jsx';
import { ParentReport }  from './views/pages/ParentReport.jsx';

export default function App() {
  const vm = useAppVM();

  // ── 학생 로그인 화면 ──
  if (vm.mode === 'login') return (
    <LoginPage students={vm.students} onStudent={vm.onStudentLogin} onAdmin={vm.onAdminLogin} />
  );

  // ── 학생 시험 화면 ──
  if (vm.mode === 'student') return (
    <StudentExam
      student={vm.currentStudent}
      assignments={vm.assignments}
      papers={vm.papers}
      onSave={vm.saveRecord}
      onLogout={vm.onLogout}
    />
  );

  // ── 관리자 화면 ──
  const renderPage = () => {
    if (vm.page === 'studentDetail' && vm.selectedStudent) return (
      <StudentDetail
        student={vm.selectedStudent}
        records={vm.records}
        papers={vm.papers}
        onBack={() => vm.navigateTo('students')}
        onUpdateMemo={vm.updateMemo}
      />
    );
    switch (vm.page) {
      case 'dashboard': return (
        <Dashboard students={vm.students} records={vm.records} papers={vm.papers} dashboard={vm.dashboard} onNav={vm.navigateTo} />
      );
      case 'assign': return (
        <AssignPage students={vm.students} papers={vm.papers} assignments={vm.assignments} onAdd={vm.addAssignment} onDelete={vm.deleteAssignment} />
      );
      case 'students': return (
        <StudentList students={vm.students} records={vm.records} papers={vm.papers}
          onSelect={vm.openStudentDetail} onAdd={vm.addStudent} onAddBulk={vm.addBulkStudents} onDelete={vm.deleteStudent} />
      );
      case 'entry': return (
        <TestEntry students={vm.students} papers={vm.papers} onSave={vm.saveRecord} />
      );
      case 'records': return (
        <RecordsPage records={vm.records} students={vm.students} papers={vm.papers} onDelete={vm.deleteRecord} onExport={vm.exportCSV} />
      );
      case 'papers': return (
        <PaperMgmt papers={vm.papers} records={vm.records} onAdd={vm.addPaper} onDelete={vm.deletePaper} onUpdate={vm.updatePaper} />
      );
      case 'analytics': return (
        <Analytics students={vm.students} records={vm.records} papers={vm.papers} />
      );
      case 'report': return (
        <ParentReport students={vm.students} records={vm.records} papers={vm.papers} />
      );
      default: return (
        <Dashboard students={vm.students} records={vm.records} papers={vm.papers} dashboard={vm.dashboard} onNav={vm.navigateTo} />
      );
    }
  };

  return (
    <div className="app">
      <Sidebar
        page={vm.page}
        onChange={vm.navigateTo}
        onLogout={vm.onLogout}
        counts={{ s:vm.students.length, r:vm.records.length, a:vm.assignments.filter((a) => !a.used).length }}
      />
      <main className="main">{renderPage()}</main>
    </div>
  );
}
