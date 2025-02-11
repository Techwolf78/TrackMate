import PropTypes from 'prop-types';

const AffiliationSelect = ({ affiliation, otherAffiliation, handleChange }) => {
    return (
      <div>
        <label className="block text-sm font-medium">Affiliation</label>
        <select
          name="affiliation"
          value={affiliation}
          onChange={handleChange}
          className="p-2 w-full border-2 rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
        >
          <option value="">Select Affiliation</option>
        <option value="Autonomous">Autonomous</option>
        <option value="SPPU">Savitribai Phule Pune University (SPPU)</option>
        <option value="Mumbai">University of Mumbai</option>
        <option value="Shivaji">Shivaji University (Kolhapur)</option>
        <option value="Ambedkar">Dr. Babasaheb Ambedkar Marathwada University (Aurangabad)</option>
        <option value="Nagpur">Rashtrasant Tukadoji Maharaj Nagpur University</option>
        <option value="Amravati">Sant Gadge Baba Amravati University</option>
        <option value="North Maharashtra">North Maharashtra University (Jalgaon)</option>
        <option value="Solapur">Solapur University</option>
        <option value="SRTMU">Swami Ramanand Teerth Marathwada University (Nanded)</option>
        <option value="YCMOU">Yashwantrao Chavan Maharashtra Open University (Nashik)</option>
        <option value="DBATU">Dr. Babasaheb Ambedkar Technological University (Lonere)</option>
        <option value="MUHS">Maharashtra University of Health Sciences (Nashik)</option>
        <option value="MAFSU">Maharashtra Animal and Fishery Sciences University (Nagpur)</option>
        <option value="MPKV">Mahatma Phule Krishi Vidyapeeth (Rahuri)</option>
        <option value="PDKV">Dr. Panjabrao Deshmukh Krishi Vidyapeeth (Akola)</option>
        <option value="VNMKV">Vasantrao Naik Marathwada Krishi Vidyapeeth (Parbhani)</option>
        <option value="DBSKKV">Dr. Balasaheb Sawant Konkan Krishi Vidyapeeth (Dapoli)</option>
        <option value="MNLU_Mumbai">Maharashtra National Law University (Mumbai)</option>
        <option value="MNLU_Nagpur">Maharashtra National Law University (Nagpur)</option>
        <option value="MNLU_Aurangabad">Maharashtra National Law University (Aurangabad)</option>
        <option value="HBSU">Dr. Homi Bhabha State University (Mumbai)</option>
        <option value="HSNC">HSNC University (Mumbai)</option>
        <option value="Deccan">Deccan College Postgraduate and Research Institute (Pune)</option>
        <option value="GIPE">Gokhale Institute of Politics and Economics (Pune)</option>
        <option value="TMV">Tilak Maharashtra Vidyapeeth (Pune)</option>
        <option value="TISS">Tata Institute of Social Sciences (Mumbai)</option>
        <option value="SIU">Symbiosis International University (Pune)</option>
        <option value="Bharati">Bharati Vidyapeeth (Pune)</option>
        <option value="DYPatil">D.Y. Patil University (Navi Mumbai)</option>
        <option value="MIT_ADT">MIT Art, Design and Technology University (Pune)</option>
        <option value="ADYPU">Ajeenkya D Y Patil University (Pune)</option>
        <option value="Flame">Flame University (Pune)</option>
        <option value="Amity">Amity University (Mumbai)</option>
        <option value="Sandip">Sandip University (Nashik)</option>
        <option value="CSMU">Chhatrapati Shivaji Maharaj University (Navi Mumbai)</option>
        <option value="MGM">MGM University (Aurangabad)</option>
        <option value="Vishwakarma">Vishwakarma University (Pune)</option>
        <option value="Spicer">Spicer Adventist University (Pune)</option>
        <option value="SSPU">Symbiosis Skills and Professional University (Pune)</option>
        <option value="MIT_WPU">MIT World Peace University (Pune)</option>
        <option value="ICT">Institute of Chemical Technology (Mumbai)</option>
        <option value="VJTI">Veermata Jijabai Technological Institute (Mumbai)</option>
        <option value="COEP">College of Engineering Pune (Pune)</option>
        <option value="Other">Other</option>
      </select>

      {/* Show this input only if "Other" is selected */}
      {affiliation === "Other" && (
        <div className="mt-2">
          <input
            type="text"
            name="otherAffiliation"
            value={otherAffiliation}
            onChange={handleChange}
            className="p-2 w-full border-2 rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Enter other affiliation"
          />
        </div>
      )}
    </div>
  );
};

// Add PropTypes validation
AffiliationSelect.propTypes = {
  affiliation: PropTypes.string.isRequired,
  otherAffiliation: PropTypes.string,
  handleChange: PropTypes.func.isRequired,
};

export default AffiliationSelect;
