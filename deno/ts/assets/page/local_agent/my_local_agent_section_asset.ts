import { SectionAsset } from "../../base/asset_base.ts";

export class MyLocalAgentSectionAsset extends SectionAsset {
  override url = "/api/my-local-agent"; // API endpoint for this section

  title = "🐱 My Local Agent";

  override content = async (): Promise<string> => {
    return `
      <div class="my-local-agent-section markdown-content">
        <h3>Meet Your Local Agent</h3>
        <div class="agent-info">
          <div class="agent-image-container">
            <img src="https://placekitten.com/400/300" alt="Local Agent Cat" class="agent-image">
            <div class="image-caption">Your friendly local agent</div>
          </div>
          <div class="agent-details">
            <p>Welcome to your local agent! This section showcases our feline friend who helps manage your tasks and provides assistance.</p>
            
            <h4>Features:</h4>
            <ul>
              <li>📁 File Management</li>
              <li>🔍 Content Analysis</li>
              <li>📝 Task Automation</li>
              <li>🎨 Creative Assistance</li>
            </ul>

            <h4>Current Status:</h4>
            <div class="status-indicator">
              <span class="status-dot online"></span>
              <span>Online and ready to help</span>
            </div>

            <h4>Quick Actions:</h4>
            <div class="quick-actions">
              <button class="action-btn">Check Tasks</button>
              <button class="action-btn">Generate Report</button>
              <button class="action-btn">Analyze Files</button>
            </div>
          </div>
        </div>

        <div class="agent-stats">
          <h4>Agent Statistics</h4>
          <table>
            <thead>
              <tr>
                <th>Metric</th>
                <th>Value</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Tasks Completed</td>
                <td>156</td>
                <td><span class="status-badge success">Excellent</span></td>
              </tr>
              <tr>
                <td>Response Time</td>
                <td>< 2s</td>
                <td><span class="status-badge success">Fast</span></td>
              </tr>
              <tr>
                <td>Uptime</td>
                <td>99.8%</td>
                <td><span class="status-badge warning">Good</span></td>
              </tr>
              <tr>
                <td>User Satisfaction</td>
                <td>4.8/5</td>
                <td><span class="status-badge success">Outstanding</span></td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="agent-mission">
          <h4>Our Mission</h4>
          <p>Your local agent is dedicated to making your workflow smoother and more efficient. Whether you need help with file management, content creation, or task automation, we're here to assist you every step of the way.</p>
          
          <div class="mission-points">
            <div class="mission-point">
              <span class="mission-icon">⚡</span>
              <span>Fast and reliable service</span>
            </div>
            <div class="mission-point">
              <span class="mission-icon">🎯</span>
              <span>Precise and accurate results</span>
            </div>
            <div class="mission-point">
              <span class="mission-icon">💡</span>
              <span>Creative and innovative solutions</span>
            </div>
          </div>
        </div>
      </div>
    `;
  };
}

export const myLocalAgentSectionAsset = new MyLocalAgentSectionAsset();
