import Layout from '../components/layout/Layout';
import WorkflowBoard from '../components/workflow/WorkflowBoard';

const Dashboard = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
              Task Workflow
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Manage your tasks through different stages
            </p>
          </div>
        </div>

        <WorkflowBoard />
      </div>
    </Layout>
  );
};

export default Dashboard;