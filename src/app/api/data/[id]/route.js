import clientPromise from "@/app/lib/mongodb";
import { ObjectId } from "mongodb";



console.log(ObjectId,"ObjectId");

export async function DELETE(req, { params }) {
  const { id } = params; // Get the document ID from params
  try {
    const client = await clientPromise;
    const db = client.db("mydatabase");

    // Validate the ObjectId
    if (!ObjectId.isValid(id)) {
      return new Response(JSON.stringify({ message: "Invalid ID format" }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    // Convert id to ObjectId and delete the document
    const result = await db.collection("mycollection").deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return new Response(JSON.stringify({ message: "Entry not found." }), {
        status: 404,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    return new Response(JSON.stringify({ message: "Entry deleted successfully!" }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error deleting data:", error);
    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}



export async function PUT(req, { params }) {
    const { id } = params; // Get the document ID from params
    console.log(id,"edit");
    
    try {
      const client = await clientPromise;
      const db = client.db('mydatabase'); // Replace with your database name
      const data = await req.json();
  
      const result = await db.collection('mycollection').updateOne(
        { _id: new ObjectId(id) }, // Use ObjectId to find the document
        { $set: data }
      );
  
      if (result.modifiedCount === 0) {
        return new Response(JSON.stringify({ message: 'Entry not found or no changes made.' }), {
          status: 404,
          headers: {
            'Content-Type': 'application/json',
          },
        });
      }
  
      return new Response(JSON.stringify({ message: 'Entry updated successfully!' }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      console.error('Error updating data:', error);
      return new Response(JSON.stringify({ message: 'Internal Server Error' }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }
  }
  


export async function GET(req, { params }) {
  const { id } = params; // Get the document ID from params

  try {
    const client = await clientPromise;
    const db = client.db("mydatabase");

    console.log("Fetching document with ID:", id);

    // Validate the ObjectId
    if (!ObjectId.isValid(id)) {
      return new Response(JSON.stringify({ message: "Invalid ID format" }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    // Convert id to ObjectId and find the document
    const document = await db.collection("mycollection").findOne({ _id: new ObjectId(id) });

    if (!document) {
      return new Response(JSON.stringify({ message: "Entry not found." }), {
        status: 404,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    return new Response(JSON.stringify(document), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
