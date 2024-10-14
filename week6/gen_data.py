import random
import json
from datetime import datetime, timedelta
import numpy as np
from sklearn.cluster import KMeans

def generate_network_data(num_nodes=200, start_date='2024-10-11', end_date='2024-10-20', connection_probability=0.1, num_clusters=5):
    nodes = []
    connections = []
    events = []

    # Generate nodes with timestamps
    start_time = datetime.fromisoformat(start_date)
    end_time = datetime.fromisoformat(end_date)

    for i in range(num_nodes):
        entry_time = start_time + timedelta(days=random.randint(0, (end_time - start_time).days))
        nodes.append({"id": i, "timestamp": entry_time.isoformat()})

        for j in range(i):
            if random.random() < connection_probability:
                connection_time = max(nodes[i]["timestamp"], nodes[j]["timestamp"])
                connections.append({"source": i, "target": j, "timestamp": connection_time})

    # Define events
    events.append({"event": "Kickoff party", "date": "2024-10-11"})
    events.append({"event": "Community Dinners", "date": "2024-10-13"})
    events.append({"event": "Regenerative Systems Dialogue", "date": "2024-10-14"})
    events.append({"event": "Lightning Talks", "date": "2024-10-17"})
    events.append({"event": "Closing Party", "date": "2024-10-20"})

    # Generate random positions for clustering
    node_positions = np.random.rand(num_nodes, 2)  # random positions for clustering
    kmeans = KMeans(n_clusters=num_clusters)
    kmeans.fit(node_positions)
    clusters = kmeans.labels_ 

    # Attach clusters to nodes
    for i in range(num_nodes):
        nodes[i]["cluster"] = int(clusters[i])

    return {
        "nodes": nodes,
        "links": connections,
        "events": events
}

# Generate the data with clusters
network_data = generate_network_data