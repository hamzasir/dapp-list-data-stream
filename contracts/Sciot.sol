pragma solidity ^0.5.0;


contract AccessControlled {
    address internal contractOwner;
    address internal newContractOwner;

    bool public paused = false;

    event ContractOwnershipTransferred(address indexed _from, address indexed _to);
    event ContractPaused();
    event ContractUnPaused();

    constructor() internal {
        contractOwner = msg.sender;
    }

    modifier onlyContractOwner {
        require(msg.sender == contractOwner);
        _;
    }

    function transferContractOwnership(address _newContractOwner) 
    external 
    onlyContractOwner {
        newContractOwner = _newContractOwner;
    }

    function acceptContractOwnership() 
    external {
        require(msg.sender == newContractOwner);
        emit ContractOwnershipTransferred(contractOwner, newContractOwner);
        contractOwner = newContractOwner;
        newContractOwner = address(0);
    }

    // handle pause
    modifier whenNotPaused {
        require(!paused || msg.sender == contractOwner);
        _;
    }

    modifier whenPaused {
        require(paused && msg.sender == contractOwner);
        _;
    }

    function pause() external onlyContractOwner whenNotPaused {
        paused = true;
        emit ContractPaused();
    }

    function unPause() external onlyContractOwner whenPaused {
        paused = false;
        emit ContractUnPaused();
    }

    function isPaused() internal view onlyContractOwner returns (bool) {
        return paused;
    }

}


contract Sciot is AccessControlled {
    event dataPointAdded(
        address indexed _address,
        bytes32 indexed stream,
        uint32 indexed timestamp,
        uint value,
        uint8 decimalDigits);

    event dataStreamAdded(
        address indexed _address,
        bytes32 _dataStreamName
    );

    event dataSourceAdded(
        address indexed _address,
        bytes32 _dataStreamName,
        address _dataSource
    );

    event dataSourceDisabled(
        address indexed _address,
        bytes32 _dataStreamName,
        address _dataSource
    );

    event dataSourceEnabled(
        address indexed _address,
        bytes32 _dataStreamName,
        address _dataSource
    );


    struct source {
        bool initialized;
        bool active;
    }

    struct dataStream {
        bool initialized;
        bool active;

        address[] sourcesCount;
        mapping (address => source) sources;
    }

    bytes32[] private dataStreamsCount;
    // map name -> dataStream
    mapping (bytes32 => dataStream) private dataStreams;


    modifier dataStreamInitialised(bytes32 _dataStreamName) {
        require(dataStreams[_dataStreamName].initialized);
        _;
    }

    modifier dataStreamAcceptData(bytes32 _dataStreamName, address _address) {
        require(
            dataStreams[_dataStreamName].initialized
            && dataStreams[_dataStreamName].active
            && _dataStreamName[0] != 0
            && _address != address(0)
            && (dataStreams[_dataStreamName].sources[_address].active || _address == contractOwner)
        );
        _;
    }

    function addDataStream(bytes32 _dataStreamName)
    external
    onlyContractOwner
    {
        require(!dataStreams[_dataStreamName].initialized
        && _dataStreamName[0] != 0
        );

        dataStreamsCount.push(_dataStreamName);
        dataStreams[_dataStreamName].initialized = true;
        dataStreams[_dataStreamName].active = true;

        emit dataStreamAdded(msg.sender, _dataStreamName);
    }


    function addDataStreamSource(bytes32 _dataStreamName, address _address)
    external
    onlyContractOwner
    {
        require(
            dataStreams[_dataStreamName].initialized
            && _dataStreamName[0] != 0
            && _address != address(0)
            && !dataStreams[_dataStreamName].sources[_address].initialized
        );

        dataStreams[_dataStreamName].sourcesCount.push(_address);
        dataStreams[_dataStreamName].sources[_address].initialized = true;
        dataStreams[_dataStreamName].sources[_address].active = true;

        emit dataSourceAdded(msg.sender,_dataStreamName, _address);
    }

    function disableDataStreamSource(bytes32 _dataStreamName, address _address)
    external
    onlyContractOwner
    {
        require(
            dataStreams[_dataStreamName].initialized
            && _dataStreamName[0] != 0
            && _address != address(0)
            && dataStreams[_dataStreamName].sources[_address].initialized
        );

        dataStreams[_dataStreamName].sources[_address].active = false;

        emit dataSourceDisabled(msg.sender,_dataStreamName, _address);
    }


    function enableDataStreamSource(bytes32 _dataStreamName, address _address)
    external
    onlyContractOwner
    {
        require(
            dataStreams[_dataStreamName].initialized
            && _dataStreamName[0] != 0
            && _address != address(0)
            && dataStreams[_dataStreamName].sources[_address].initialized
        );

        dataStreams[_dataStreamName].sources[_address].active = true;

        emit dataSourceEnabled(msg.sender,_dataStreamName, _address);
    }


    function addDataPoint (
        bytes32 stream,
        uint32 timestamp,
        uint value,
        uint8 decimalDigits
    )
    external
    dataStreamAcceptData(stream, msg.sender)
    whenNotPaused
    {
        emit dataPointAdded(msg.sender, stream, timestamp, value, decimalDigits);
    }


    function getDataStreams() public view returns ( bytes32[] memory) {
        return dataStreamsCount;
    }

    function getDataStreamStatus(bytes32 name) public view returns (bool) {
        return dataStreams[name].active;
    }

    function getDataStreamSourceStatus(bytes32 _dataStreamName, address _address) public view returns (bool) {
        return dataStreams[_dataStreamName].sources[_address].active;
    }

    function getDataStreamSourcesAddresses(bytes32 name) public view returns (address[] memory) {
        return dataStreams[name].sourcesCount;
    }
}
