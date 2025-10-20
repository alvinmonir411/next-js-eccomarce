import React from "react";

const page = () => {
  return (
    <div>
      <h1 className="text-3xl text-center  font-bold">Add New Product Here</h1>
      <div>
        <form>
          <div>
            <p>Genarale Information</p>

            <label>Title</label>
            <input placeholder="Type Your Title" type="Text" required />
          </div>
        </form>
      </div>
    </div>
  );
};

export default page;
