@extends('layouts.app')

@section('content')
<div class="container">
    <h1>{{ $company->name }}</h1>

    @if (session('status'))
        <div class="alert alert-success">
            {{ session('status') }}
        </div>
    @endif

    @can('manage', $company)
        <h2>Manage Users</h2>
        <form action="{{ route('companies.addUser', $company) }}" method="POST">
            @csrf
            <div class="mb-3">
                <label for="user_id" class="form-label">Add User</label>
                <select id="user_id" name="user_id" class="form-control">
                    @foreach ($users as $user)
                        <option value="{{ $user->id }}">{{ $user->name }}</option>
                    @endforeach
                </select>
            </div>
            <button type="submit" class="btn btn-primary">Add User</button>
        </form>

        <h2>Current Users</h2>
        <ul>
            @foreach ($company->members as $member)
                <li>
                    {{ $member->name }}
                    <form action="{{ route('companies.removeUser', [$company, $member]) }}" method="POST" style="display:inline;">
                        @csrf
                        @method('DELETE')
                        <button type="submit" class="btn btn-danger btn-sm">Remove</button>
                    </form>
                </li>
            @endforeach
        </ul>
    @else
        <h2>Users</h2>
        <ul>
            @foreach ($company->members as $member)
                <li>{{ $member->name }}</li>
            @endforeach
        </ul>
    @endcan

    <h2>Files</h2>
    
        <form action="{{ route('companies.uploadFile', $company) }}" method="POST" enctype="multipart/form-data">
            @csrf
            <div class="mb-3">
                <label for="file" class="form-label">Upload File</label>
                <input type="file" id="file" name="file" class="form-control">
            </div>
            <button type="submit" class="btn btn-primary">Upload</button>
        </form>
    

    <ul>
    @if ($files && $files->count() > 0)
        @foreach ($files as $file)
            <li>
                {{ $file->name }} (uploaded by {{ $file->uploader->name }})
                <a href="{{ route('companies.downloadFile', $file) }}" class="btn btn-sm btn-secondary">Download</a>
            </li>
            <li>
                {{ $file->name }} (uploaded by {{ $file->uploader->name }})
                @can('manage', $company)
                    <form action="{{ route('companies.destroyFile', [$company, $file]) }}" method="POST" style="display:inline;">
                        @csrf
                        @method('DELETE')
                        <button type="submit" class="btn btn-danger btn-sm">Remove</button>
                    </form>
                @endcan
            </li>

        @endforeach
    @else
        <p>No files available.</p>
    @endif
    </ul>

</div>
@endsection