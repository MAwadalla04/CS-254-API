export default {
    async fetch(request, env, ctx) {
        const url = new URL(request.url);

        // --- Basic CORS Headers ---
        // Allows your resume page (on pages.dev) to request data from your worker
        const corsHeaders = {
            'Access-Control-Allow-Origin': '*', // You can restrict this to your actual Pages domain later if needed
            'Access-Control-Allow-Methods': 'GET, OPTIONS', // We only need GET for this counter
            'Access-Control-Allow-Headers': 'Content-Type', // Standard header
        };

        // Handle CORS preflight requests (browsers send these automatically)
        if (request.method === 'OPTIONS') {
            return new Response(null, { headers: corsHeaders });
        }
        // --- End CORS Handling ---

        // Define the API endpoint for getting/incrementing the visit count
        if (url.pathname === '/visits' && request.method === 'GET') {
            try {
                // Ensure the D1 database binding exists in wrangler.jsonc/toml and is configured
                if (!env.DB) {
                   // If the binding isn't configured, return an error
                   console.error("D1 Database binding 'DB' not found. Check wrangler.jsonc/toml configuration.");
                   throw new Error("D1 Database binding 'DB' not found.");
                }

                // Increment the counter and get the new value.
                // We assume a single row with id = 1 exists for the counter.
                // Note: This isn't perfectly atomic under very high load, but fine for this use case.
                const updateStmt = env.DB.prepare(
                    'UPDATE site_visits SET count = count + 1 WHERE id = 1'
                    );
                await updateStmt.run();

                // Select the updated count
                const selectStmt = env.DB.prepare(
                    'SELECT count FROM site_visits WHERE id = 1'
                    );
                const result = await selectStmt.first(); // Use first() as we expect only one row

                // Use the count from D1, or 0 if the row somehow doesn't exist
                const count = result ? result.count : 0;

                // Return the count as JSON
                return new Response(JSON.stringify({ visits: count }), {
                    headers: {
                        ...corsHeaders, // Include CORS headers in the response
                        'Content-Type': 'application/json' // Tell the browser it's JSON data
                    },
                });

            } catch (e) {
                // Log the error to the worker console for debugging
                console.error("Worker Error:", e);
                // Return an error response to the browser
                return new Response(JSON.stringify({ visits: 'N/A', error: e.message }), {
                     status: 500, // Internal Server Error status code
                     headers: {
                        ...corsHeaders, // Include CORS headers
                        'Content-Type': 'application/json'
                    },
                });
            }
        }

        // Fallback response for any other path requested on your worker
        return new Response('Not Found', {
            status: 404, // Not Found status code
            headers: corsHeaders // Include CORS headers
        });
    },
};
