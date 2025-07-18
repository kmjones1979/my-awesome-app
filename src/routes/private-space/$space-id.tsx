import { Button } from '@/components/ui/button';
import { AcademicField } from '@/schema';
import {
  HypergraphSpaceProvider,
  preparePublish,
  publishOps,
  useCreateEntity,
  useHypergraphApp,
  useQuery,
  useSpace,
  useSpaces,
} from '@graphprotocol/hypergraph-react';
import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';

export const Route = createFileRoute('/private-space/$space-id')({
  component: RouteComponent,
});

function RouteComponent() {
  const { 'space-id': spaceId } = Route.useParams();

  return (
    <HypergraphSpaceProvider space={spaceId}>
      <PrivateSpace />
    </HypergraphSpaceProvider>
  );
}

function PrivateSpace() {
  const { name, ready } = useSpace({ mode: 'private' });
  const { data: academicFields } = useQuery(AcademicField, { mode: 'private' });
  const { data: publicSpaces } = useSpaces({ mode: 'public' });
  const [selectedSpace, setSelectedSpace] = useState<string>('');
  const createAddress = useCreateEntity(AcademicField);
  const [addressName, setAddressName] = useState('');
  const { getSmartSessionClient } = useHypergraphApp();

  if (!ready) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading space...</p>
        </div>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    createAddress({ name: addressName, description: 'Beautiful academicField' });
    setAddressName('');
  };

  const publishToPublicSpace = async (academicField: AcademicField) => {
    if (!selectedSpace) {
      alert('No space selected');
      return;
    }
    try {
      const { ops } = await preparePublish({ entity: academicField, publicSpace: selectedSpace });
      const smartSessionClient = await getSmartSessionClient();
      if (!smartSessionClient) {
        throw new Error('Missing smartSessionClient');
      }
      const publishResult = await publishOps({
        ops,
        space: selectedSpace,
        name: 'Publish AcademicField',
        walletClient: smartSessionClient,
      });
      console.log(publishResult, ops);
      alert('AcademicField published to public space');
    } catch (error) {
      console.error(error);
      alert('Error publishing academicField to public space');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">{name}</h1>
          <p className="text-muted-foreground">Manage your private academicFields and publish them to public spaces</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Create AcademicField Form */}
          <div className="space-y-6">
            <div className="bg-card border rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-card-foreground mb-4">Create New AcademicField</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="academicField-name" className="text-sm font-medium text-card-foreground">
                    AcademicField Name
                  </label>
                  <input
                    id="academicField-name"
                    type="text"
                    value={addressName}
                    onChange={(e) => setAddressName(e.target.value)}
                    placeholder="Enter academicField name..."
                    className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={!addressName.trim()}>
                  Create AcademicField
                </Button>
              </form>
            </div>
          </div>

          {/* Addresses List */}
          <div className="space-y-6">
            <div className="bg-card border rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-card-foreground mb-4">
                Your Addresses ({academicFields?.length || 0})
              </h2>

              {academicFields && academicFields.length > 0 ? (
                <div className="space-y-4">
                  {academicFields.map((academicField) => (
                    <div key={academicField.id} className="border border-border rounded-lg p-4 bg-background">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-medium text-foreground">{academicField.name}</h3>
                        <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                          ID: {academicField.id.slice(0, 8)}...
                        </span>
                      </div>

                      <div className="space-y-3">
                        <div className="space-y-2">
                          <label className="text-xs font-medium text-muted-foreground">
                            Select Public Space to Publish
                          </label>
                          <select
                            value={selectedSpace}
                            onChange={(e) => setSelectedSpace(e.target.value)}
                            className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                          >
                            <option value="">Choose a public space...</option>
                            {publicSpaces?.map((space) => (
                              <option key={space.id} value={space.id}>
                                {space.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        <Button
                          onClick={() => publishToPublicSpace(academicField)}
                          disabled={!selectedSpace}
                          variant="outline"
                          size="sm"
                          className="w-full"
                        >
                          Publish to Public Space
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-muted-foreground mb-2">
                    <svg
                      className="mx-auto h-12 w-12 mb-4 opacity-50"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                      />
                    </svg>
                  </div>
                  <p className="text-muted-foreground">No academicFields created yet</p>
                  <p className="text-sm text-muted-foreground mt-1">Create your first academicField using the form</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
