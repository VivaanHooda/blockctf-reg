'use client';

import { useState, useEffect } from 'react';
import { Search, Plus, Trash2, Edit2, LogOut, X, Download } from 'lucide-react';
import { toast } from 'sonner';
import SpotlightCard from './SpotlightCard';
import './AdminPanel.css';

interface TeamMember {
  name: string;
  email: string;
  phone: string;
  year: string;
  branch: string;
  usn: string;
}

interface Team {
  id: string;
  team_name: string;
  team_size: number;
  members: TeamMember[];
  created_at: string;
}

interface AdminPanelProps {
  onLogout: () => void;
}

export default function AdminPanel({ onLogout }: AdminPanelProps) {
  const [teams, setTeams] = useState<Team[]>([]);
  const [filteredTeams, setFilteredTeams] = useState<Team[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const [activeTab, setActiveTab] = useState<'teams' | 'members'>('teams');
  const [registrationsOpen, setRegistrationsOpen] = useState(true);
  const [formData, setFormData] = useState({
    teamName: '',
    teamSize: '1',
    members: [{ name: '', email: '', phone: '', year: '1st', branch: 'ISE', usn: '' }],
  });

  useEffect(() => {
    fetchTeams();
    fetchRegistrationStatus();
  }, []);

  useEffect(() => {
    const filtered = teams.filter((team) =>
      team.team_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      team.members.some((member) =>
        member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.email.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
    setFilteredTeams(filtered);
  }, [searchQuery, teams]);

  const getAllMembers = () => {
    const allMembers: Array<TeamMember & { teamName: string; teamId: string }> = [];
    teams.forEach((team) => {
      team.members.forEach((member) => {
        allMembers.push({ ...member, teamName: team.team_name, teamId: team.id });
      });
    });
    return allMembers;
  };

  const getFilteredMembers = () => {
    const allMembers = getAllMembers();
    return allMembers.filter((member) =>
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.teamName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const exportToCSV = () => {
    try {
      const csvData: string[] = [];
      
      // Add header row
      const headers = ['Team Name', 'Team Size', 'Member Name', 'Email', 'Phone', 'Year', 'Branch', 'USN', 'Registration Time'];
      csvData.push(headers.map(h => `"${h}"`).join(','));

      // Add data rows
      teams.forEach((team) => {
        team.members.forEach((member) => {
          const registrationTime = new Date(team.created_at).toLocaleString('en-IN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false,
          });
          
          const row = [
            `"${team.team_name}"`,
            `"${team.team_size}"`,
            `"${member.name}"`,
            `"${member.email}"`,
            `"${member.phone}"`,
            `"${member.year}"`,
            `"${member.branch}"`,
            `"${member.usn}"`,
            `"${registrationTime}"`,
          ];
          csvData.push(row.join(','));
        });
      });

      // Create blob and download
      const csvContent = csvData.join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      
      const timestamp = new Date().toISOString().slice(0, 10);
      link.setAttribute('href', url);
      link.setAttribute('download', `blockchain-ctf-registrations-${timestamp}.csv`);
      link.style.visibility = 'hidden';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success('CSV exported successfully!');
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export CSV');
    }
  };

  const fetchRegistrationStatus = async () => {
    try {
      const response = await fetch('/api/admin/settings');
      const data = await response.json();
      setRegistrationsOpen(data.registrationsOpen);
    } catch (error) {
      console.error('Failed to fetch registration status:', error);
    }
  };

  const toggleRegistrations = async () => {
    try {
      const newStatus = !registrationsOpen;
      console.log('Toggling registrations to:', newStatus);
      
      const response = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ registrationsOpen: newStatus }),
      });

      console.log('Settings API response status:', response.status);
      const responseData = await response.json();
      console.log('Settings API response data:', responseData);

      if (response.ok) {
        setRegistrationsOpen(newStatus);
        toast.success(
          newStatus ? '✅ Registrations opened' : '🔒 Registrations closed'
        );
      } else {
        console.error('API error:', responseData);
        toast.error('Failed to update registration status: ' + (responseData.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Toggle error:', error);
      toast.error('Failed to toggle registrations');
    }
  };

  const fetchTeams = async () => {
    try {
      setIsLoading(true);
      const { supabase } = await import('@/lib/supabase');
      const { data, error } = await supabase
        .from('registrations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTeams(data || []);
      setFilteredTeams(data || []);
    } catch (error) {
      toast.error('Failed to fetch teams');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteTeam = async (id: string, teamName: string) => {
    if (!confirm(`Are you sure you want to delete team "${teamName}"?`)) return;

    try {
      const { supabase } = await import('@/lib/supabase');
      const { error } = await supabase
        .from('registrations')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success(`Team "${teamName}" deleted`);
      setTeams(teams.filter((t) => t.id !== id));
      setSelectedTeam(null);
    } catch (error) {
      toast.error('Failed to delete team');
      console.error(error);
    }
  };

  const handleOpenAddModal = () => {
    setEditingTeam(null);
    setFormData({
      teamName: '',
      teamSize: '1',
      members: [{ name: '', email: '', phone: '', year: '1st', branch: 'ISE', usn: '' }],
    });
    setShowAddModal(true);
  };

  const handleOpenEditModal = (team: Team) => {
    setEditingTeam(team);
    setFormData({
      teamName: team.team_name,
      teamSize: team.team_size.toString(),
      members: team.members,
    });
    setShowAddModal(true);
  };

  const handleTeamSizeChange = (newSize: string) => {
    const size = parseInt(newSize);
    const currentMembers = formData.members.length;

    if (size > currentMembers) {
      // Add new member slots
      const newMembers = [...formData.members];
      for (let i = currentMembers; i < size; i++) {
        newMembers.push({ name: '', email: '', phone: '', year: '1st', branch: 'ISE', usn: '' });
      }
      setFormData({ ...formData, teamSize: newSize, members: newMembers });
    } else {
      // Remove member slots
      setFormData({ ...formData, teamSize: newSize, members: formData.members.slice(0, size) });
    }
  };

  const handleSaveTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { supabase } = await import('@/lib/supabase');
      
      if (editingTeam) {
        // Update team
        const { error } = await supabase
          .from('registrations')
          .update({
            team_name: formData.teamName,
            team_size: parseInt(formData.teamSize),
            members: formData.members,
          })
          .eq('id', editingTeam.id);

        if (error) throw error;
        toast.success('Team updated successfully');
      } else {
        // Add new team
        const { error } = await supabase
          .from('registrations')
          .insert([
            {
              team_name: formData.teamName,
              team_size: parseInt(formData.teamSize),
              members: formData.members,
              created_at: new Date().toISOString(),
            },
          ]);

        if (error) throw error;
        toast.success('Team added successfully');
      }

      setShowAddModal(false);
      fetchTeams();
    } catch (error) {
      toast.error('Failed to save team');
      console.error(error);
    }
  };

  return (
    <div className="admin-panel">
        <div className="admin-header">
          <div className="admin-header-left">
            <h1>Admin Dashboard</h1>
            <p>Manage all team registrations</p>
          </div>
          <button className="admin-logout-btn" onClick={onLogout}>
            <LogOut size={16} />
            Logout
          </button>
        </div>

        <div className="admin-toolbar">
          <div className="admin-search">
            <Search size={18} />
            <input
              type="text"
              placeholder={activeTab === 'teams' ? 'Search teams...' : 'Search members...'}
              value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        {activeTab === 'teams' && (
          <button className="admin-add-btn" onClick={handleOpenAddModal}>
            <Plus size={18} />
            Add Team
          </button>
        )}
        <button className="admin-export-btn" onClick={exportToCSV} title="Export all data to CSV">
          <Download size={18} />
          Export CSV
        </button>
        <button 
          className={`admin-registration-toggle ${registrationsOpen ? 'open' : 'closed'}`}
          onClick={toggleRegistrations}
          title={registrationsOpen ? 'Click to close registrations' : 'Click to open registrations'}
        >
          <span className="toggle-indicator">{registrationsOpen ? '✓' : '✕'}</span>
          {registrationsOpen ? 'Registrations Open' : 'Registrations Closed'}
        </button>
      </div>

      <div className="admin-tabs">
        <button
          className={`tab-btn ${activeTab === 'teams' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('teams')}
        >
          Teams
        </button>
        <button
          className={`tab-btn ${activeTab === 'members' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('members')}
        >
          All Members
        </button>
      </div>

      <div className="admin-stats">
        <div className="stat-card">
          <p>Total Teams</p>
          <h3>{teams.length}</h3>
        </div>
        <div className="stat-card">
          <p>Total Members</p>
          <h3>{teams.reduce((sum, t) => sum + t.members.length, 0)}</h3>
        </div>
      </div>

      {isLoading ? (
        <div className="admin-loading">Loading data...</div>
      ) : activeTab === 'teams' ? (
        <>
          {filteredTeams.length === 0 ? (
            <div className="admin-empty">No teams found</div>
          ) : (
            <div className="admin-teams-list">
              {filteredTeams.map((team) => (
                <div
                  key={team.id}
                  className="admin-team-row"
                  onClick={() => setSelectedTeam(team)}
                >
                  <span className="team-name-text">{team.team_name}</span>
                  <span className="team-members-count">({team.team_size})</span>
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        <>
          {getFilteredMembers().length === 0 ? (
            <div className="admin-empty">No members found</div>
          ) : (
            <div className="admin-members-list">
              {getFilteredMembers().map((member, idx) => (
                <div key={idx} className="admin-member-row">
                  <div className="member-info-main">
                    <p className="member-name">{member.name}</p>
                    <p className="member-team">{member.teamName}</p>
                  </div>
                  <div className="member-info-contact">
                    <p className="member-email">{member.email}</p>
                    <p className="member-phone">{member.phone}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {selectedTeam && (
        <TeamDetailsModal
          team={selectedTeam}
          onClose={() => setSelectedTeam(null)}
          onEdit={() => {
            handleOpenEditModal(selectedTeam);
            setSelectedTeam(null);
          }}
          onDelete={() => handleDeleteTeam(selectedTeam.id, selectedTeam.team_name)}
        />
      )}

      {showAddModal && (
        <AdminTeamModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          isEditing={!!editingTeam}
          formData={formData}
          setFormData={setFormData}
          onTeamSizeChange={handleTeamSizeChange}
          onSave={handleSaveTeam}
        />
      )}
    </div>
  );
}

interface TeamDetailsModalProps {
  team: Team;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

function TeamDetailsModal({ team, onClose, onEdit, onDelete }: TeamDetailsModalProps) {
  return (
    <div className="admin-modal-overlay" onClick={onClose}>
      <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
        <div className="admin-modal-header">
          <h2>{team.team_name}</h2>
          <button className="admin-modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="team-details-content">
          <div className="detail-section">
            <h3>Team Info</h3>
            <p><strong>Team Size:</strong> {team.team_size} member(s)</p>
            <p><strong>Registered:</strong> {new Date(team.created_at).toLocaleDateString('en-IN')}</p>
          </div>

          <div className="detail-section">
            <h3>Members</h3>
            {team.members.map((member, idx) => (
              <SpotlightCard
                key={idx}
                className="member-spotlight-card"
                spotlightColor="rgba(34, 197, 94, 0.2)"
              >
                <p className="member-name">{idx + 1}. {member.name}</p>
                <div className="member-info">
                  <p><span className="info-label">Email:</span> {member.email}</p>
                  <p><span className="info-label">Phone:</span> {member.phone}</p>
                  <p><span className="info-label">Year:</span> {member.year}</p>
                  <p><span className="info-label">Branch:</span> {member.branch}</p>
                  <p><span className="info-label">USN:</span> {member.usn}</p>
                </div>
              </SpotlightCard>
            ))}
          </div>

          <div className="detail-actions">
            <button className="detail-edit-btn" onClick={onEdit}>
              <Edit2 size={16} /> Edit
            </button>
            <button className="detail-delete-btn" onClick={onDelete}>
              <Trash2 size={16} /> Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

interface AdminTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  isEditing: boolean;
  formData: any;
  setFormData: (data: any) => void;
  onTeamSizeChange: (size: string) => void;
  onSave: (e: React.FormEvent) => Promise<void>;
}

function AdminTeamModal({
  isOpen,
  onClose,
  isEditing,
  formData,
  setFormData,
  onTeamSizeChange,
  onSave,
}: AdminTeamModalProps) {
  if (!isOpen) return null;

  const handleMemberChange = (index: number, field: string, value: string) => {
    const updatedMembers = [...formData.members];
    updatedMembers[index] = { ...updatedMembers[index], [field]: value };
    setFormData({ ...formData, members: updatedMembers });
  };

  return (
    <div className="admin-modal-overlay">
      <div className="admin-modal">
        <div className="admin-modal-header">
          <h2>{isEditing ? 'Edit Team' : 'Add New Team'}</h2>
          <button className="admin-modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={onSave} className="admin-modal-form">
          <div className="admin-form-group">
            <label>Team Name</label>
            <input
              type="text"
              value={formData.teamName}
              onChange={(e) => setFormData({ ...formData, teamName: e.target.value })}
              placeholder="Enter team name"
              required
            />
          </div>

          <div className="admin-form-group">
            <label>Team Size</label>
            <select
              value={formData.teamSize}
              onChange={(e) => onTeamSizeChange(e.target.value)}
            >
              <option value="1">Solo (1 Member)</option>
              <option value="2">Duo (2 Members)</option>
            </select>
          </div>

          <div className="admin-members-section">
            <h3>Team Members</h3>
            {formData.members.map((member: TeamMember, index: number) => (
              <div key={index} className="admin-member-form">
                <h4>Member {index + 1}</h4>
                <input
                  type="text"
                  placeholder="Name"
                  value={member.name}
                  onChange={(e) => handleMemberChange(index, 'name', e.target.value)}
                  required
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={member.email}
                  onChange={(e) => handleMemberChange(index, 'email', e.target.value)}
                  required
                />
                <input
                  type="tel"
                  placeholder="Phone"
                  value={member.phone}
                  onChange={(e) => handleMemberChange(index, 'phone', e.target.value)}
                  required
                />
                <select
                  value={member.year}
                  onChange={(e) => handleMemberChange(index, 'year', e.target.value)}
                >
                  <option>1st</option>
                  <option>2nd</option>
                  <option>3rd</option>
                  <option>4th</option>
                </select>
                <select
                  value={member.branch}
                  onChange={(e) => handleMemberChange(index, 'branch', e.target.value)}
                >
                  <option>ISE</option>
                  <option>CSE</option>
                  <option>ECE</option>
                  <option>EEE</option>
                  <option>ME</option>
                  <option>CE</option>
                </select>
                <input
                  type="text"
                  placeholder="USN"
                  value={member.usn}
                  onChange={(e) => handleMemberChange(index, 'usn', e.target.value)}
                  required
                />
              </div>
            ))}
          </div>

          <div className="admin-modal-actions">
            <button type="button" className="admin-cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="admin-save-btn">
              {isEditing ? 'Update Team' : 'Add Team'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
