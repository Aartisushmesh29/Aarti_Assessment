import React, { useEffect, useState, useRef } from 'react'; 
import { DataTable } from 'primereact/datatable'; // Import DataTable
import { Column } from 'primereact/column'; // Import Column
import { Paginator } from 'primereact/paginator'; // Import Paginator
import { OverlayPanel } from 'primereact/overlaypanel'; // Import OverlayPanel
import { Button } from 'primereact/button'; // Import Button
import { InputNumber } from 'primereact/inputnumber'; // Import InputNumber
import "./App.css"

// Define the Artwork interface
interface Artwork {
  id: number;
  title: string;
  artist_display: string;
  place_of_origin?: string;
  date_start?: string;
  date_end?: string;
}

// Define the App component
const App: React.FC = () => {
  const [artworks, setArtworks] = useState<Artwork[]>([]); // Initialize artworks state
  const [loading, setLoading] = useState<boolean>(true); // Initialize loading state
  const [totalRecords, setTotalRecords] = useState<number>(0); // Initialize totalRecords state
  const [page, setPage] = useState<number>(1); // Initialize page state
  const [rowClick, setRowClick] = useState<boolean>(false); // Initialize rowClick state
  const [selectedArtworks, setSelectedArtworks] = useState<Artwork[]>([]); // Initialize selectedArtworks state
  const [rowsPerPage, setRowsPerPage] = useState<number>(12); // Initialize rowsPerPage state
  const [rowsToSelect, setRowsToSelect] = useState<number | null>(null); // Initialize rowsToSelect state
  const overlayPanelRef = useRef<OverlayPanel>(null); // Initialize overlayPanelRef ref

  // Fetch artworks from the API
  useEffect(() => {
    const fetchArtworks = async () => {
      setLoading(true);
      try {
        const response = await fetch(`https://api.artic.edu/api/v1/artworks?page=${page}&limit=${rowsPerPage}`);
        const data = await response.json();
        setArtworks(data.data); // Set artworks state
        setTotalRecords(data.pagination.total); // Set totalRecords state
      } catch (error) {
        console.error('Error fetching artworks:', error);
      } finally { // Set loading state to false
        setLoading(false); 
      }
    };

    fetchArtworks(); // Call fetchArtworks function
  }, [page, rowsPerPage]); // Call fetchArtworks function when page or rowsPerPage change

  // Handle page change
  const onPageChange = (e: any) => {
    setPage(e.page + 1);
  };

  // Handle submit
  const handleSubmit = async () => {
    if (rowsToSelect === null) return;

    const totalToSelect = Math.min(rowsToSelect, totalRecords); // Get the minimum of rowsToSelect and totalRecords
    let selected: Artwork[] = []; // Initialize selected array
    let currentPage = 1; // Initialize currentPage
    let remaining = totalToSelect; // Initialize remaining

    setLoading(true); // Set loading state to true

    // Fetch rows for selection
    try {
      while (selected.length < totalToSelect && currentPage * rowsPerPage <= totalRecords) {
        const response = await fetch(`https://api.artic.edu/api/v1/artworks?page=${currentPage}&limit=${rowsPerPage}`);
        const data = await response.json();
        const rows = data.data.slice(0, remaining); // Get the first remaining rows
        selected = [...selected, ...rows]; // Add rows to selected array
        remaining -= rows.length; // Subtract the number of rows from remaining
        currentPage++; // Increment currentPage
      }
      setSelectedArtworks(selected); // Set selectedArtworks state
    } catch (error) {
      console.error('Error fetching rows for selection:', error);
    } finally {
      setLoading(false);
      overlayPanelRef.current?.hide(); // Hide overlayPanel
    }
  };

  // Return the JSX for the App component
  return (
    <div style={{ padding: '16px', backgroundColor: '#f0f0f0', borderRadius: '8px', maxWidth: '100%', margin: '0 auto' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', textAlign: 'center', color: '#333', marginBottom: '16px' }}>Artworks</h1>

      <DataTable
        value={artworks}
        paginator
        lazy
        first={(page - 1) * rowsPerPage}
        rows={rowsPerPage}
        totalRecords={totalRecords}
        loading={loading}
        onPage={(e) => onPageChange(e)}
        style={{ backgroundColor: '#fff', borderRadius: '8px' }}
        selectionMode={rowClick ? null : 'checkbox'}
        selection={selectedArtworks}
        onSelectionChange={(e) => setSelectedArtworks(e.value)}
      >
        {/* Render the columns */}
        {!rowClick && (
          <Column
            selectionMode="multiple"
            header={() => (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px' }}>
                <Button
                  icon="pi pi-angle-down"
                  onClick={(e) => overlayPanelRef.current?.toggle(e)}
                  className="p-button-outlined"
                />
                <OverlayPanel ref={overlayPanelRef} showCloseIcon style={{ width: '256px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '16px' }}>
                    <InputNumber
                      value={rowsToSelect}
                      onValueChange={(e) => setRowsToSelect(e.value || null)}
                      placeholder="Enter number of rows"
                      style={{ width: '100%', marginBottom: '8px' }}
                    />
                    <Button label="Submit" onClick={handleSubmit} style={{ marginTop: '8px' }} />
                  </div>
                </OverlayPanel>
              </div>
            )}
            headerStyle={{ width: '3em' }}
          />
        )}
        <Column field="title" header="Title" style={{ width: '20%' }} />
        <Column field="place_of_origin" header="Place of Origin" style={{ width: '20%' }} />
        <Column field="artist_display" header="Artist" style={{ width: '30%' }} />
        <Column field="date_start" header="Date Start" style={{ width: '10%' }} />
        <Column field="date_end" header="Date End" style={{ width: '10%' }} />
      </DataTable>
    </div>
  );
};

export default App;
